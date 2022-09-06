import { app, BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron'
import DownloadManager from './DownloadManager'
import '../renderer/store'
import menu from './menu'
import * as helpers from './helpers'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

ipcMain.handle('updateTitle', (event, data) => {
    if (data.length < 1)
        electronMainWindow.mainWindow.setTitle(helpers.fetchTitle())
    else
        electronMainWindow.mainWindow.setTitle(helpers.fetchTitle() + ` - ${data}`)
})

global.debugMode = app.commandLine.hasSwitch('developer')

let customURL_enable = app.commandLine.hasSwitch('url')
let customURL = app.commandLine.getSwitchValue('url')

const winURL_dev = 'http://dev.sixgrid.kate.pet:9080'
let winURL
if (global.debugMode && customURL_enable)
{
    if (customURL_enable)
    {
        winURL = customURL
    }
    else
    {
        winURL = winURL_dev
    }   
}
else
{
    winURL = process.env.NODE_ENV === 'development' ? winURL_dev : `file://${__dirname}/index.html`
}
global.electronMainWindow = null
global.sixgridDownloadManager = null
function createWindow () {
    app.allowRendererProcessReuse = false
    global.electronMainWindow = new BrowserWindow({
        useContentSize: true,
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        allowRendererProcessReuse: false,
        useContentSize: true,
        allowRendererProcessReuse: false,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
            allowRunningInsecureContent: false,
            devTools: true,
            experimentalFeatures: true
        }
    })
    global.sixgridDownloadManager = new DownloadManager(global.electronMainWindow)

    electronMainWindow.setMenu(null)
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
    electronMainWindow.setTitle(helpers.fetchTitle())

    electronMainWindow.loadURL(winURL)

    electronMainWindow.on('closed', () => {
        electronMainWindow = null
    })

    electronMainWindow.webContents.on('before-input-event', (event, input) => {
        switch (input.key.toLowerCase()) {
            case 'f8':
                event.preventDefault()
                electronMainWindow.loadURL(winURL)
                break
        }
    })

    // Send uncaught exceptions to renderer
    process.on('uncaughtException', (error) => {
        electronMainWindow.webContents.send('uncaughtException', JSON.stringify(error))
    })
    ipcMain.on('restart', () => {
        helpers.relaunch()
    })
}

app.on('ready', createWindow)

app.on('ready', () => {
    const SHORTCUTDICT = {
        'F10': () => {
            helpers.relaunchConfirm()
        },
        'F9': () => {
            electronMainWindow.webContents.send('debug:elementOutline')
        },
        'F8': () => {
            helpers.safeReload()
        }
    }

    let entries = Object.entries(SHORTCUTDICT)
    for (let i = 0; i < entries.length; i++) {
        globalShortcut.register(...entries[i])
    }
})

// Register 'file://' URL's
app.on('ready', () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURI(request.url.replace('file:///', ''))
        callback(pathname)
    })
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (electronMainWindow === null) {
        createWindow()
    }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
})

app.on('ready', () => {
    if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
*/
