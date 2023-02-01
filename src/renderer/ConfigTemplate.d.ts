import { IClientAuthOptions } from 'libsixgrid/dist/src/Client'
import { PostRating } from 'libsixgrid'
import { MetricManagerData } from './MetricManager'

export interface AuthTemplate
{
    auth: IClientAuthOptions
    endpoint: string
}
export interface IConfig_AuthProfile
{
    items: AuthTemplate[]
    _current: number
}

export interface IConfig_User
{
    media: {
        autoplay: boolean,
        loop: boolean
    },
    downloadFolder: string
    saveMetadata: boolean
    tagBlacklist: string[]
    ratingFilter: PostRating
    preloadPageCount: number
    preloadStartIndex: number
    highQualityPreview: boolean
    sortByScore: boolean
    sortByFavorite: boolean
    ratingSafe: boolean
    ratingQuestionable: boolean
    ratingExplicit: boolean
}

export interface IConfig_Stats
{
    metricStore: MetricManagerData
}