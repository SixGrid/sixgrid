import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import type { GlobalShortcutData } from '../shared/config'
declare global {
    namespace NodeJS {
        interface Global {
            electronMainWindow: BrowserWindow|null
            __SIXGRID_PRODUCT_BUILD_VERSION: string
            __PRODUCT_EXTENDED_INFORMATION: IProductInformation
            __static: string
            debugMode: boolean
            globalShortcut_data: GlobalShortcutData
        }
    }
}
export {}