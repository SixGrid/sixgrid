import * as helpers from './helpers'
const isMac = process.platform == 'darwin'
export default [
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
            { role: 'zoom' }
        ]
    },
    {
        label: 'View',
        submenu: [
            {
                label: 'Safe Reload',
                accelerator: 'F8',
                click: helpers.safeReload
            },
            { type: 'separator' },
            {
                label: 'Toggle Developer Tools',
                accelerator: 'F12',
                click: () => {
                    if (electronMainWindow != undefined && electronMainWindow.mainWindow != undefined)
                        electronMainWindow.webContents.openDevTools()
                }
            }
        ]
    }
]