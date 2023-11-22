import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import type { GlobalShortcutData } from './globalShortcuts'
declare global
{
    var electronMainWindow: BrowserWindow|undefined
    var __SIXGRID_PRODUCT_BUILD_VERSION: string
    var __PRODUCT_EXTENDED_INFORMATION: IProductInformation
    var __static: string
    var debugMode: boolean
    var globalShortcut_data: GlobalShortcutData
}

