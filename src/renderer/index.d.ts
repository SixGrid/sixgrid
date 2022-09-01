import Configuration from './Configuration'
import type {EventEmitter} from 'events'
import Post from 'libsixgrid/dist/src/Post'
interface ISteamCloudLocations
{
    Config: string
}
interface IAppData
{
    ApplicationIdentifier: string

    get UserDataPath(): string

    reloadClient(): void

    tempStore: {[key: string]: any}
    tempStoreEventEmitter: EventEmitter

    Set(key: string, value: any): void
    Get(key: string, value: any): void

    DeepAssign(target: any, source: any): any

    OpenExternal(url: string): void

    PostDownload(postObject: Post): void
    FetchClientParameters(): any
    SteamCloudLocations: ISteamCloudLocations
    CloudConfig: {[key: string]: Configuration}
}
declare global
{
    var AppData: IAppData
}
export {}