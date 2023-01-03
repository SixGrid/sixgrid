import { IClientAuthOptions } from 'libsixgrid/dist/src/Client'
import { PostRating } from 'libsixgrid'

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
    download_completeCount: number
    uncaughtException: number
    favorite_count: number
    search_count: number
    post_downvote_count: number
    post_upvote_count: number
}