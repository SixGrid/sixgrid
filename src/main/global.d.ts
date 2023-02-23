import type { IProductInformation } from '../shared'
import type { BrowserWindow } from 'electron'
import { WriteStream } from 'fs'
declare global
{
    var electronMainWindow: BrowserWindow|undefined
    var __SIXGRID_PRODUCT_BUILD_VERSION: string
    var __PRODUCT_EXTENDED_INFORMATION: IProductInformation
    var __static: string
    var debugMode: boolean
    var logfile_FileStream: WriteStream
}

