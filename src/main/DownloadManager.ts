import { ipcMain } from "electron"
import { BrowserWindow } from "electron/main"

import * as helpers from './helpers'
import * as fs from 'fs'
import * as path from 'path'
import * as toolbox from 'tinytoolbox'
import request from 'request'

export interface IPostState
{
    id: number
    url: string
    endpoint: string
    bytesDownloaded: number
    bytesTotal: number
    fileLocation: string
    fileHash: string
    timestamp: EpochTimeStamp
    completeTimestamp: EpochTimeStamp
}
export interface IDownloadEventData
{
    id: number
    url: string
    endpoint: string
    targetLocation: string
    forceDownload: boolean
}
export const DefaultIDownloadEventData: IDownloadEventData =
{
    id: 0,
    url: '',
    endpoint: '',
    targetLocation: '',
    forceDownload: false
}
export default class DownloadManager
{
    public Window: BrowserWindow
    public static PostCacheLocation: string = path.resolve(`./PostCache`)
    public constructor(window: BrowserWindow)
    {
        this.Window = window
        this.InitializeListeners()
    }

    public Posts: {[key: string]: IPostState} = {}

    private InitializeListeners(): void
    {
        ipcMain.handle('downloadManager:post:state', (event, postID) =>
        {
            return this.Posts[postID]
        })
        ipcMain.handle('downloadManager:post:download', (event, data: IDownloadEventData=DefaultIDownloadEventData) =>
        {
            data = {
                ...DefaultIDownloadEventData,
                ...data
            }
            
            if (data.forceDownload)
            {
                let existsAlready = false
                if (fs.existsSync(data.targetLocation))
                {
                    fs.unlinkSync(data.targetLocation)
                    existsAlready = true
                }
                this.StartDownload(data)
                return {
                    success: true,
                    error: null,
                    message: `download+force${existsAlready ? '+exists' : ''}` 
                }
            }
            if (this.Posts[data.id] == undefined)
            {
                this.StartDownload(data)
                return {
                    success: true,
                    error: null,
                    message: `download`
                }
            }
            else
            {
                let checksumMismatch = false
                if (fs.existsSync(data.targetLocation))
                {
                    // Check if there is a checksum mismatch
                    let targetHash = helpers.SHA256Checksum(data.targetLocation)
                    if (targetHash == this.Posts[data.id].fileHash)
                    {
                        return {
                            success: false,
                            error: new Error(`File already exists`),
                            message: 'exists'
                        }
                    }
                }
                if (checksumMismatch)
                {
                    this.StartDownload(data)
                    return {
                        success: true,
                        error: null,
                        message: `download+checksumMismatch`
                    }
                }
                return {
                    success: true,
                    error: null,
                    message: 'exists'
                }
            }
        })
    }
    public StartDownload(options: IDownloadEventData): void
    {
        let timestamp = Date.now()
        let fileExtension = options.url.split('.').pop()
        let fileHash = ''
        let temporaryFileLocation = path.join(DownloadManager.PostCacheLocation, `.tmp_${toolbox.stringGen(16, toolbox.StringGenCharsetType.AlphaNumeric)}`)

        let req: request.Request = request({
            method: 'GET',
            url: options.url
        })

        let outputStream = fs.createWriteStream(temporaryFileLocation, { flags: 'w' })

        let totalBytes = 0
        let recievedBytes = 0

        req.pipe(outputStream)

        let cacheData = {
            id: options.id,
            url: options.url,
            endpoint: options.endpoint,
            bytesDownloaded: recievedBytes,
            bytesTotal: totalBytes,
            fileLocation: temporaryFileLocation,
            fileHash,
            timestamp,
            completeTimestamp: Date.now()
        }

        let updateInterval: NodeJS.Timeout
        let previousRecievedBytes = -100
        req.on('response', (data: request.Request) => {
            totalBytes = parseInt(data.headers['content-length'])
            updateInterval = setInterval(() => {
                if (recievedBytes != previousRecievedBytes)
                {
                    previousRecievedBytes = recievedBytes
                    this.Window.webContents.send('downloadManager:post:download:status', cacheData)
                }
            }, 30)
        })
        req.on('data', (chunk) => {
            recievedBytes += chunk.length
            cacheData.bytesDownloaded = recievedBytes
            cacheData.bytesTotal = totalBytes
        })
        outputStream.on('finish', () => {
            clearInterval(updateInterval)
            this.Window.webContents.send('downloadManager:post:download:status', cacheData)
            fileHash = helpers.SHA256Checksum(temporaryFileLocation)
            let outputLocation = path.join(DownloadManager.PostCacheLocation, fileHash + '.' + fileExtension)
            fs.writeFileSync(outputLocation, fs.readFileSync(temporaryFileLocation), { mode: 'w' })
            fs.unlinkSync(temporaryFileLocation)

            cacheData = {
                id: options.id,
                url: options.url,
                endpoint: options.endpoint,
                bytesDownloaded: recievedBytes,
                bytesTotal: totalBytes,
                fileLocation: outputLocation,
                fileHash,
                timestamp,
                completeTimestamp: Date.now()
            }
            this.Posts[options.id] = cacheData

            this.Window.webContents.send('downloadManager:post:download:complete', this.Posts[options.id])
        })
    }
}