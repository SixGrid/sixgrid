import { app, dialog } from 'electron'
import * as path from 'path'
import flags from './flags'
const _ProductInformation = __PRODUCT_EXTENDED_INFORMATION
export function isDevelopmentMode () {
    if (app.commandLine.hasSwitch('dev'))
        return true
    return process.env.NODE_ENV === 'development'
}
export function fetchTitle () {
    let value = `SixGrid v${__SIXGRID_PRODUCT_BUILD_VERSION} (${_ProductInformation.commitHashShort})`
    if (electronMainWindow != undefined)
        electronMainWindow.webContents.send('title:update', value)
    return value
}
export function safeReload () {
    if (electronMainWindow != undefined)
        electronMainWindow.loadURL(flags.winUrl)
}
export function relaunch () {
    app.relaunch()
    app.quit()
}
export function relaunchConfirm () {
    if (global.electronMainWindow == undefined) return
    var btn = dialog.showMessageBoxSync(global.electronMainWindow, {
        message: 'Are you sure you would like to relaunch?',
        title: `SixGrid ${__SIXGRID_PRODUCT_BUILD_VERSION} - Confirm`,
        buttons: [
            `Cancel`,
            `Relaunch`
        ]
    })
    
    if (btn == 1) {
        relaunch()
    }
}

export function steamCloudConfigDirectory() {
    let target = path.join(path.dirname(process.execPath), 'AppConfig')
    if (path.basename(process.execPath).startsWith('electron')) {
        target = path.join(process.cwd(), 'AppConfig')
    }
    return target
}
