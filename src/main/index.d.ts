import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
declare global {
    namespace NodeJS {
        interface Global {
            electronMainWindow: BrowserWindow|null
            __SIXGRID_PRODUCT_BUILD_VERSION: string
            __PRODUCT_EXTENDED_INFORMATION: IProductInformation
            __static: string
            debugMode: boolean
        }
    }
}
export {}