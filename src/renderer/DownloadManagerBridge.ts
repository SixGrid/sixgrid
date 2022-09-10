import { ipcRenderer } from "electron"
import { Post } from "libsixgrid"
import { DownloadResponse, IDownloadEventData, IPostState } from "../DownloadManager.shared"
import * as path from 'path'
import {EventEmitter} from 'events'

export class DownloadManagerBridge extends EventEmitter
{
    public Posts: {[key: string]: IPostState} = {}

    public constructor()
    {
        super()
        this.InitializeEvents()
    }
    private async InitializeEvents()
    {
        ipcRenderer.on('downloadManager:post:download:complete', (event, post: IPostState) =>
        {
            console.log(post.id)
            this.Posts[post.id] = post
            this.emit('post:download:complete', post)
        })
        ipcRenderer.on('downloadManager:post:download:status', (event, post: IPostState) =>
        {
            console.log(post)
            let diff = post.bytesDownloaded - this.Posts[post.id].bytesDownloaded
            console.log(diff)
            if (diff > 0)
            {
                let kbchange = diff / 1e+6
                console.debug(`[DownloadManagerBridge->postDownloadStatus] ${post.id} ${(post.bytesDownloaded / post.bytesTotal).toFixed(4)}% (${kbchange * 10}mb/s)`)
            }
            this.Posts[post.id] = post
            this.emit('post:state:update', this.Posts[post.id])
        })
    }
    public GetState(postId: string): Promise<IPostState|null>
    {
        return ipcRenderer.invoke('downloadManager:post:state', postId)
    }

    public async UpdatePostStates(): Promise<void>
    {
        this.Posts = await ipcRenderer.invoke('downloadManager:post:state')
        this.emit('post:state:update:all')
    }

    public InitializeDownload(post: Post, forceDownload: boolean=false): Promise<DownloadResponse>
    {
        let eventData: IDownloadEventData =
        {
            id: post.ID,
            url: post.Image.File.url ?? post.Image.Sample.url ?? post.Image.Preview.url ?? '',
            endpoint: post.Client.Endpoint,
            targetLocation: path.join(AppData.CloudConfig.User._data.downloadFolder, `${post.Image.File.md5}.${post.Image.File.ext}`),
            forceDownload
        }
        return ipcRenderer.invoke('downloadManager:post:download', eventData)
    }
}