import { app, BrowserWindow, globalShortcut, ipcMain, Menu, protocol } from 'electron'
import '../renderer/store'
import menu from './menu'
import * as helpers from './helpers'
import * as os from 'os'
import TelemetryManager from './telemetryManager/index'
let isSteamDeck: boolean = os.release().toString().includes('valve')
app.allowRendererProcessReuse = false

if (isSteamDeck) {
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
    if (global.electronMainWindow == undefined) return
    if (data.length < 1)
        global.electronMainWindow.setTitle(helpers.fetchTitle())
    else
        global.electronMainWindow.setTitle(helpers.fetchTitle() + ` - ${data}`)
})

global.debugMode = app.commandLine.hasSwitch('developer')
app.commandLine.appendSwitch('in-process-gpu')
let customURL_enable = app.commandLine.hasSwitch('url')
let customURL = app.commandLine.getSwitchValue('url')

const winURL_dev = 'http://localhost:9080'
let winURL: string = ''
if (global.debugMode && customURL_enable)
{
    winURL = customURL_enable ? customURL : winURL_dev
}
else
{
    winURL = process.env.NODE_ENV === 'development' ? winURL_dev : `file://${__dirname}/index.html`
}
function createWindow () {
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
    let telemetry: TelemetryManager|null = null
    if (isSteamDeck) {
        global.electronMainWindow.webContents.setFrameRate(60)
        console.log(`Set framerate to 60fps`)
    }
    if (process.argv.includes('--steam')) {
        telemetry = new TelemetryManager(global.electronMainWindow)
    }

    global.electronMainWindow.setMenu(null)
    Menu.setApplicationMenu(Menu.buildFromTemplate(menu))
    global.electronMainWindow.setTitle(helpers.fetchTitle())

    global.electronMainWindow.loadURL(winURL)

    global.electronMainWindow.on('closed', () => {
        if (telemetry != null)
        {
            telemetry.close()
        }
        delete global.electronMainWindow
    })

    global.electronMainWindow.webContents.on('before-input-event', (event, input) => {
        if (global.electronMainWindow == undefined) return
        switch (input.key.toLowerCase()) {
            case 'f8':
                event.preventDefault()
                global.electronMainWindow.loadURL(winURL)
                break
        }
    })

    // Send uncaught exceptions to renderer
    process.on('uncaughtException', (error) => {
        if (global.electronMainWindow == undefined) return
        global.electronMainWindow.webContents.send('uncaughtException', JSON.stringify(error))
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
            if (global.electronMainWindow == undefined) return
            global.electronMainWindow.webContents.send('debug:elementOutline')
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
