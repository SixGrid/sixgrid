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

export interface DownloadResponse
{
    success: boolean
    error?: Error
    message: string
}