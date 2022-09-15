import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import DownloadManager from './DownloadManager'
import FavoriteManager from './FavoriteManager'

declare global {
    namespace NodeJS {
        interface Global {
            electronMainWindow: BrowserWindow|null
            sixgridDownloadManager: DownloadManager
            sixgridFavoriteManager: FavoriteManager
            __SIXGRID_PRODUCT_BUILD_VERSION: string
            __PRODUCT_EXTENDED_INFORMATION: IProductInformation
            __static: string
            debugMode: boolean
        }
    }
}
export {}