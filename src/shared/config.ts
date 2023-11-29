import { IClientAuthOptions } from 'libsixgrid/dist/src/Client'
import { PostRating } from 'libsixgrid'
import { MetricManagerData } from './metricManager'
import { KeybindProfile } from '../renderer/Keybinder/KeybindProfile'

export interface PostDataSetConfig
{
    key: ConfigKeys,
    data: any
}

export interface ConfigTypeMap {
    'Authentication': IConfig_AuthProfile
    'User': IConfig_User
    'Statistics': IConfig_Stats
    'Keybind': IConfig_Keybind
}
export declare type ConfigKeys = 
    'Authentication' |
    'User' |
    'Statistics' |
    'Keybind'

export const ConfigFileMap: {[key in ConfigKeys]: string} = {
    'Authentication': 'authProfile.json',
    'User': 'config.json',
    'Statistics': 'stats.json',
    'Keybind': 'keybind.json'
}

export interface AuthTemplate
{
    auth: IClientAuthOptions
    endpoint: string
}
export interface IConfig_AuthProfile
{
    items: AuthTemplate[]
    /**
     * @description
     * Index of `items` for the currently used authentication profile
     */
    _current: number
}

export interface GlobalShortcutData
{
    relaunch: Electron.Accelerator|null
    debugOutline: Electron.Accelerator|null
    safeReload: Electron.Accelerator|null
}
export interface IConfig_User
{
    media: {
        autoplay: boolean,
        loop: boolean
    },
    /**
     * @description
     * Folder to download to
     */
    downloadFolder: string
    saveMetadata: boolean
    /**
     * @description
     * Additional tags to filter posts with
     */
    tagBlacklist: string[]
    ratingFilter: PostRating
    preloadPageCount: number
    preloadStartIndex: number
    /**
     * @description
     * Use full file instead of preview file when loading
     */
    highQualityPreview: boolean
    sortByScore: boolean
    sortByFavorite: boolean

    /**
     * @description
     * Allow posts tagged with `rating:s`
     */
    ratingSafe: boolean
    /**
     * @description
     * Allow posts tagged with `rating:q`
     */
    ratingQuestionable: boolean
    /**
     * @description
     * Allow posts tagged with `rating:e`
     */
    ratingExplicit: boolean

    /**
     * @description
     * Float between `0.5` and `3.0`
     */
    zoomFactor: number

    mainProcShortcuts: GlobalShortcutData
}

export interface IConfig_Stats
{
    metricStore: MetricManagerData
}
export interface IConfig_Keybind
{
    currentProfile: string
    currentProfileData: KeybindProfile
    profiles: {[key: string]: KeybindProfile}
}