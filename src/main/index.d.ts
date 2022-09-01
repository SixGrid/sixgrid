import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
declare global
{
    var electronMainWindow: BrowserWindow
    var __SIXGRID_PRODUCT_BUILD_VERSION: string
    var __PRODUCT_EXTENDED_INFORMATION: IProductInformation
}
export {}