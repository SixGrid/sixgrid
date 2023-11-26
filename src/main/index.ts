import { app, BrowserWindow, globalShortcut, ipcMain, Menu, protocol } from 'electron'
import '../renderer/store'
import menu from './menu'
import * as helpers from './helpers'
import * as os from 'os'
import * as globalShortcuts from './globalShortcuts'
import { ConfigManager } from './config/configManager'

import flags from './flags'

if (flags.isSteamDeck) {
    app.disableHardwareAcceleration()
    console.log(`Running on Steam Deck. Hardware Acceleration has been disabled due to some linux issues.`)
}

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

ipcMain.handle('updateTitle', (event, data) => {
    setTitle(data)
})

export function setTitle(append: string='') {
    if (global.electronMainWindow == undefined) return

    if (append.length < 1)
        global.electronMainWindow.setTitle(helpers.fetchTitle())
    else
        global.electronMainWindow.setTitle(helpers.fetchTitle() + ` - ${append}`)
}

global.debugMode = flags.debugMode
app.commandLine.appendSwitch('in-process-gpu')

function createWindow () {
    app.allowRendererProcessReuse = false
    global.electronMainWindow = new BrowserWindow({
        useContentSize: true,
        width: 1280,
        height: 720,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false,
            allowRunningInsecureContent: false,
            devTools: true,
            experimentalFeatures: true,
            contextIsolation: false
        }
    })

    global.configManager = new ConfigManager()

    globalShortcuts.init()
    if (flags.isSteamDeck) {
        global.electronMainWindow.webContents.setFrameRate(60)
        console.log(`Set framerate to 60fps`)
    }

    // set title
    global.electronMainWindow.setMenu(null)
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
    global.electronMainWindow.setTitle(helpers.fetchTitle())

    global.electronMainWindow.loadURL(flags.winUrl)

    // save config on close
    global.electronMainWindow.on('closed', () => {
        delete global.electronMainWindow
        ConfigManager.instance.saveAll(false)
    })

    // Send uncaught exceptions to renderer
    process.on('uncaughtException', (error) => {
        if (global.electronMainWindow == undefined) return
        global.electronMainWindow.webContents.send('uncaughtException', JSON.stringify(error))
    })
    ipcMain.on('restart', () => {
        ConfigManager.instance.saveAll(false)
        helpers.relaunch()
    })
}

app.on('ready', createWindow)


// Register 'file://' URL's
app.on('ready', () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = decodeURI(request.url.replace('file:///', ''))
        callback(pathname)
    })
})


app.on('window-all-closed', () => {
    app.quit()
    process.exit(0)
})

app.on('activate', () => {
    if (global.electronMainWindow === null) {
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
