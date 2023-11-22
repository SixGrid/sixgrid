import * as helpers from './helpers'
import {MenuItemConstructorOptions, MenuItem} from 'electron'
const isMac = process.platform == 'darwin'
const menuTemplate: any = [
    ...(isMac ? [{ role: 'appMenu' }] : []),
    {
        label: 'File',
        submenu: [
            { type: 'separator' },
            {
                label: 'Relaunch',
                click: () => {
                    helpers.relaunch()
                }
            },
            isMac ? { role: 'close' } : { role: 'quit' }
        ]
    },
    {
        label: 'Window',
        submenu: [
            { role: 'minimize' },
            { role: 'zoom' },
            { role: 'togglefullscreen' }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Safe Reload',
                click: helpers.safeReload
            },
            { type: 'separator' },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'F12',
                click: () => {
                    if (global.electronMainWindow != undefined && global.electronMainWindow.webContents != undefined)
                        global.electronMainWindow.webContents.toggleDevTools()
                }
            }
        ]
    }
]
export default menuTemplate