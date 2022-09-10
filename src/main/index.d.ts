import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import DownloadManager from './DownloadManager'

declare global {
    namespace NodeJS {
        interface Global {
            electronMainWindow: BrowserWindow|null
            sixgridDownloadManager: DownloadManager
            __SIXGRID_PRODUCT_BUILD_VERSION: string
            __PRODUCT_EXTENDED_INFORMATION: IProductInformation
            __static: string
            debugMode: boolean
        }
    }
}
export {}