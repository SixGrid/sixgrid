import { app, BrowserWindow } from 'electron'
import '../renderer/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
    global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

global.debugMode = app.commandLine.hasSwitch('developer')

let customURL_enable = app.commandLine.hasSwitch('url')
let customURL = app.commandLine.getSwitchValue('url')

const winURL_dev = 'http://dev.sixgrid.kate.pet:9080'
let mainWindow
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

function createWindow () {
    app.allowRendererProcessReuse = false
    mainWindow = new BrowserWindow({
        height: 720,
        useContentSize: true,
        width: 1280,
        allowRendererProcessReuse: false,
        webPreferences: {
            allowRendererProcessReuse: false,
            nodeIntegration: true,
            enableRemoteModule: true,
            webSecurity: false
        }
    })

    mainWindow.loadURL(winURL)

    mainWindow.on('closed', () => {
        mainWindow = null
    })

    mainWindow.webContents.on('before-input-event', (event, input) => {
        switch (input.key.toLowerCase()) {
            case 'f8':
                event.preventDefault()
                mainWindow.loadURL(winURL)
                break
        }
    })

    // Send uncaught exceptions to renderer
    process.on('uncaughtException', (error) => {
        mainWindow.webContents.send('uncaughtException', JSON.stringify(error))
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
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
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
