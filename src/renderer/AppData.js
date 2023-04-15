const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ConfigManager = require('./ConfigManager').default
const esixapi = require('libsixgrid')
const EventEmitter = require('events')
const {default: Configuration} = require('./Configuration')
const { default: Steamworks } = require('./SteamworksIntergration')
const { default: MetricManager } = require('./MetricManager')
const {KeybindManager} = require('./Keybinder/KeybindManager')
const request = require('request')
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
var AppData = {
    ApplicationIdentifier: 'sixgrid',
    Event: new EventEmitter(),
    get UserDataPath () {
        let val = path.join(
            electron.remote.app.getPath('userData'),
            this.ApplicationIdentifier)
        if (!fs.existsSync(val))
            fs.mkdirSync(val, {recursive: true})
        return val
    },
    Config: null,
    Client: null,
    reloadClient () {
        let currentAuthentication = global.AppData.FetchClientParameters()
        if (global.AppData.Client != undefined)
            global.AppData.Client.Gatekeeper.Destroy()
        currentAuthentication.product = {
            name: 'SixGrid',
            version: __SIXGRID_PRODUCT_BUILD_VERSION
        }
        global.AppData.Client = new esixapi.Client(currentAuthentication)
        global.AppData.Client.on('post:favorite', () => {
            AppData.MetricManager.Increment('favorite_count')
        })
        global.AppData.Client.on('post:vote', (data) => {
            if (data.state > 0)
                AppData.MetricManager.Increment('post_upvote_count')
            else if (data.state < 0)
                AppData.MetricManager.Increment('post_downvote_count')
        })
        global.AppData.Client.on('post:search', () => {
            AppData.MetricManager.Increment('search_count')
        })
    },

    tempStore: {},
    tempStoreEventEmitter: new EventEmitter(),

    Set(key, value) {
        this.tempStore[key] = value
        this.tempStoreEventEmitter.emit(key, value)
    },
    Get(key, defaultValue) {
        let result = this.tempStore[key]
        if (result == undefined)
            return defaultValue
        else
            return result
    },

    DeepAssign(target, source) {
        let output = Object.assign({}, target);
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target))
                        Object.assign(output, { [key]: source[key] });
                    else
                        output[key] = AppData.DeepAssign(target[key], source[key]);
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    },

    OpenExternal (url) {
        require('electron').shell.openExternal(url)
    },

    PostDownload (postObject) {
        let targetURL = postObject.Image.File.url

        let req = request({
            method: 'GET',
            url: targetURL
        })
        let out = fs.createWriteStream(path.join(AppData.CloudConfig.User.get().downloadFolder, `${postObject.ID}.${postObject.Image.File.md5}.${postObject.Image.File.ext}`))

        let totalBytes = 0
        let recievedBytes = 0
        let chunkCountSize = []

        req.pipe(out)
        req.on('response', (data) => {
            totalBytes = parseInt(data.headers['content-length'])
        })
        req.on('data', (chunk) => {
            recievedBytes += chunk.length
            chunkCountSize.push(chunk.length)
        })
        out.on('finish', () => {
            if (AppData.CloudConfig.User.saveMetadata) {
                let loc = path.join(AppData.CloudConfig.User.get().downloadFolder, `${postObject.ID}.${postObject.Image.File.md5}.json`)
                if (!fs.existsSync(loc)) {
                    fs.writeFileSync(loc, JSON.stringify(postObject.toJSON(), null, '    '))
                    console.log(`[AppData->PostDownload] Saved metadata for post ${postObject.ID}`)
                }
            }
            console.log(`[AppData->PostDownload] Completed ${postObject.ID}.${postObject.Image.File.ext} (${parseFloat(totalBytes/1000).toFixed(3)}kb)`)
            AppData.MetricManager.Increment('download_completeCount')
        })
    },

    FetchClientParameters () {
        let currentAuthentication = global.AppData.CloudConfig.Authentication.get('_current')
        return global.AppData.CloudConfig.Authentication.get().items[currentAuthentication]
    },

    SteamCloudLocations: {
        get Config() {
            let target = path.join(path.dirname(process.execPath), 'AppConfig')
            if (path.basename(process.execPath).startsWith('electron')) {
                target = path.join(process.cwd(), 'AppConfig')
            }
            return target
        }
    },

    CloudConfig: {},

    get AllowSteamworks()
    {
        return require('electron').remote.process.argv.includes('--steam')
    },

    isFloat(n) {
        return Number(n) === n && n % 1 !== 0;
    },
    isInt(n) {
        return Number(n) === n && n % 1 === 0;
    },
    get RootURI () {
        return (process.env.NODE_ENV === 'development' ? `http://dev.sixgrid.kate.pet:9080/` : `file://${process.platform == 'win32' ? '/' : ''}${__dirname.replaceAll('\\', '/')}/index.html`).split('?')[0]
    },
    set RootURI (value) {},

    get IsSteamDeck () {
        return require('os').release().includes('valve')
    }
}
global.AppData = AppData
global.AppData.Log = require('electron-log')
global.AppData.Config = new ConfigManager()
// global.AppData.Steamworks = new (require('@theace0296/steamworks'))(1992810)
let appIdLocation = path.resolve('steam_appid.txt')
try {
    if (!fs.existsSync(appIdLocation))
        fs.writeFileSync(appIdLocation, '1992810')
} catch (e) {
    alert(`Failed to create file ${appIdLocation}`)
}
global.AppData.Keybinder = new KeybindManager()
global.AppData.MetricManager = new MetricManager()
try {
    global.AppData.Steamworks = new Steamworks()
} catch (e) {
    if (AppData.AllowSteamworks)
        alert('Failed to initialize Steamworks', e)
    console.error(`Failed to initialize Steamworks`, e)
}
setTimeout(() =>{global.AppData.Steamworks.Initialize()}, 1500)

for (let i = 0; i < Object.entries(AppData.SteamCloudLocations).length; i++) {
    let loc = Object.entries(AppData.SteamCloudLocations)[i]
    if (!fs.existsSync(loc[1])) {
        fs.mkdirSync(loc[1], { recursive: true })
    }
}

global.AppData.Event.on('zoomFactorUpdate', () => {
    var webContents = electron.remote.getCurrentWindow().webContents
    let factor = global.AppData.CloudConfig.User.get('zoomFactor')
    if (factor == undefined)
        factor = 1.0
    webContents.setZoomFactor(parseFloat(factor))
})

require('./ConfigInit').Initialize()
global.AppData.MetricManager.Read()
global.AppData.Keybinder.Load()

global.AppData.Event.emit('zoomFactorUpdate')


