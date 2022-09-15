import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import DownloadManager from './DownloadManager'
import FavoriteManager from './FavoriteManager'
declare global
{
    var debugMode: boolean
    var sixgridDownloadManager: DownloadManager|null
    var sixgridFavoriteManager: FavoriteManager|null
    var electronMainWindow: BrowserWindow|null
    var __SIXGRID_PRODUCT_BUILD_VERSION: string
    var __PRODUCT_EXTENDED_INFORMATION: IProductInformation
    var __static: string
}

