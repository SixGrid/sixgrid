import Configuration, { IConfiguration } from './Configuration'
import type {EventEmitter} from 'events'
import Post from 'libsixgrid/dist/src/Post'
import {IProductInformation} from '../shared'
import { IConfig_AuthProfile, IConfig_Stats, IConfig_User } from './ConfigTemplate'
import MetricManager from './MetricManager'
import Steamworks from './SteamworksIntergration'

declare interface ICloudConfig 
{
    Statistics: IConfiguration<IConfig_Stats>
    User: IConfiguration<IConfig_User>
    Authentication: IConfiguration<IConfig_AuthProfile>
}
declare interface IAppData
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
    SteamCloudLocations: {
        Config: string
    }
    CloudConfig: ICloudConfig & {[key: string]: Configuration}
    AllowSteamworks: Boolean

    isInt(n: number): boolean
    isFloat(n: number): boolean

    MetricManager: MetricManager
    Steamworks: Steamworks
}
declare global
{
    var AppData: IAppData
    var __SIXGRID_PRODUCT_BUILD_VERSION: string
    var __PRODUCT_EXTENDED_INFORMATION: IProductInformation
}
export {}