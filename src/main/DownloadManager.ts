import { ipcMain } from "electron"
import { BrowserWindow } from "electron/main"

import * as helpers from './helpers'
import * as fs from 'fs'
import * as path from 'path'
import * as toolbox from 'tinytoolbox'
import request from 'request'

import {IPostState, IDownloadEventData, DefaultIDownloadEventData} from '../DownloadManager.shared'

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
            if (postID == undefined || postID == null)
                return this.Posts
            return this.Posts[postID]
        })
        ipcMain.handle('downloadManager:post:download', (event, data: IDownloadEventData=DefaultIDownloadEventData) =>
        {
            data = {
                ...DefaultIDownloadEventData,
                ...data
            }
            if (data.url.length < 1)
            {
                return {
                    success: false,
                    error: new Error(`Invalid URL`),
                    message: `url=invalid`
                }
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
        if (!fs.existsSync(path.dirname(temporaryFileLocation)))
            fs.mkdirSync(path.dirname(temporaryFileLocation), {recursive: true})

        let req: request.Request = request({
            method: 'GET',
            url: options.url
        })
        console.log(temporaryFileLocation)
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
        console.log(options)
        req.on('response', (data: request.Request) => {
            totalBytes = parseInt(data.headers['content-length'])
            updateInterval = setInterval(() => {
                console.log(recievedBytes, previousRecievedBytes)
                if (recievedBytes != previousRecievedBytes)
                {
                    previousRecievedBytes = recievedBytes
                    this.Window.webContents.send('downloadManager:post:download:status', cacheData)
                }
            }, 100)
        })
        req.on('data', (chunk) => {
            recievedBytes += chunk.length
            cacheData.bytesDownloaded = recievedBytes
            cacheData.bytesTotal = totalBytes
            console.log((recievedBytes / totalBytes).toFixed(2))
        })
        outputStream.on('finish', () => {
            console.log('complete')
            clearInterval(updateInterval)
            this.Window.webContents.send('downloadManager:post:download:status', cacheData)
            fileHash = helpers.SHA256Checksum(temporaryFileLocation)
            console.log(fileHash)
            let outputLocation = path.join(DownloadManager.PostCacheLocation, fileHash + '.' + fileExtension)
            console.log(outputLocation)
            if (!fs.existsSync(path.dirname(outputLocation)))   
                fs.mkdirSync(path.dirname(outputLocation), {recursive: true})
            console.log('copyStart')
            fs.copyFileSync(temporaryFileLocation, outputLocation)
            console.log('copyEnd')
            fs.unlinkSync(temporaryFileLocation)
            console.log('unlink')

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
            console.log(`done`, this.Posts[options.id])
            this.Window.webContents.send('downloadManager:post:download:complete', this.Posts[options.id])
        })
    }
}