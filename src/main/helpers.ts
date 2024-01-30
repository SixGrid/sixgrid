import { app, dialog } from 'electron'
import * as path from 'path'
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
        electronMainWindow.loadURL(winURL)
}
export const winURL = (() => {
    var value = isDevelopmentMode()
        ? `http://localhost:9080`
        : `file://${process.platform == 'win32' ? '/' : ''}${__dirname.replaceAll('\\', '/')}/index.html`
    return value
})()
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
export function stringArrayCharacterLength (input: string[]) {
    let length = 0
    for (let thing of input) {
        length += thing.length
    }
    return length
}
export function paragraphSplit (input: string, maximumLineWidth: number) {
    let resultList = [] /* string[][] */
    let inputSplitted = input.split(' ')
    let buffer = [] /* input[] */
    for (let i = 0; i < inputSplitted.length; i++) {
        let bufferCharLen = stringArrayCharacterLength(buffer) + buffer.length
        if (bufferCharLen + inputSplitted[i].length + 1 > maximumLineWidth) {
            resultList.push(buffer)
            buffer = []
        }
        buffer.push(inputSplitted[i])
    }

    resultList.push(buffer)

    let resultArray = []
    for (let i = 0; i < resultList.length; i++) {
        let tmp = [] /* string[] */
        for (let x = 0; x < resultList[i].length; x++) {
            tmp.push(resultList[i][x])
        }
        let tmpString = tmp.join(' ')
        resultArray.push(tmpString)
    }
    return resultArray.join('\n')
}
export function getWorkingDirectory() {
    let env = process.env
    if (env.APPIMAGE != undefined) {
        return path.dirname(env.APPIMAGE)
    }
    if (process.cwd().toLowerCase().includes('windows\\system32')) {
        return path.dirname(require('electron').app.getPath('exe'))
    }
    return process.cwd()
}
export function steamCloudConfigDirectory() {
    let target = path.join(getWorkingDirectory(), 'AppConfig')
    if (path.basename(process.cwd()).startsWith('electron')) {
        target = path.join(process.cwd(), 'AppConfig')
    }
    return target
}