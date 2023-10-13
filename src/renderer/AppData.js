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
const axios = require('axios')
const { ipcRenderer } = require('electron')
const { notifyProc }  = require('./notifyProc')

const SGHelper = require('./SGHelper')
const FeatureFlags = require('./FeatureFlags')
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
var AppData = {
    notifyProc,
    ApplicationIdentifier: 'sixgrid',
    Event: new EventEmitter(),
    Helper: SGHelper,
    FeatureFlags,
    get UserDataPath () {
        return this.Helper.GetUserDataPath()
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
        notifyProc({
            eventName: 'connect',
            data: {
                endpoint: currentAuthentication.endpoint,
                username: currentAuthentication.auth.login
            }
        })
        global.AppData.Client.on('post:favorite', () => {
            notifyProc({
                eventName: 'post:favorite',
                data: post_id
            })
            AppData.MetricManager.Increment('favorite_count')
        })
        global.AppData.Client.on('post:vote', (data) => {
            if (data.state > 0)
                AppData.MetricManager.Increment('post_upvote_count')
            else if (data.state < 0)
                AppData.MetricManager.Increment('post_downvote_count')
        })
        global.AppData.Client.on('post:search', (query) => {
            notifyProc({
                eventName: 'search',
                data: query
            })
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
        return this.Helper.DeepAssign(target, source)
    },

    OpenExternal (url) {
        return this.Helper.OpenExternal(url)
    },

    PostDownload (postObject) {
        let logScope = AppData.Log.scope('AppData.PostDownload')
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
            notifyProc({
                eventName: 'download',
                data: {
                    post_id: postObject.ID,
                    download_url: targetURL,
                    url: `${postObject.Client.Endpoint}/post/${postObject.ID}`
                }
            })
            if (AppData.CloudConfig.User.saveMetadata) {
                let loc = path.join(AppData.CloudConfig.User.get().downloadFolder, `${postObject.ID}.${postObject.Image.File.md5}.json`)
                if (!fs.existsSync(loc)) {
                    fs.writeFileSync(loc, JSON.stringify(postObject.toJSON(), null, '    '))
                    logScope.log(`Saved metadata for post ${postObject.ID}`)
                }
            }
            logScope.log(`Completed ${postObject.ID}.${postObject.Image.File.ext} (${parseFloat(totalBytes/1000).toFixed(3)}kb)`)
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
        return this.Helper.AllowSteamworks()
    },


    isFloat(n) {
        return this.Helper.isFloat(n)
    },
    isInt(n) {
        return this.Helper.isInteger(n)
    },
    get RootURI () {
        return this.Helper.RootURI()
    },
    set RootURI (value) {},

    get IsSteamDeck () {
        return this.Helper.IsSteamDeck()
    }
}
global.AppData = AppData
global.AppData.Log = require('electron-log')
global.AppData.Config = new ConfigManager()

function initSteamworks()
{
    let appIdLocation = path.resolve('steam_appid.txt')
    try {
        if (!fs.existsSync(appIdLocation))
            fs.writeFileSync(appIdLocation, '1992810')
    } catch (e) {
        alert(`[initSteamworks] Failed to create file ${appIdLocation}`)
    }
    try {
        global.AppData.Steamworks = new Steamworks()
    } catch (e) {
        if (AppData.AllowSteamworks)
            alert('[initSteamworks] Failed to initialize Steamworks', e)
        AppData.Log.error(`[initSteamworks] Failed to initialize Steamworks`, e)
    }
    setTimeout(() =>{global.AppData.Steamworks.Initialize()}, 1500)
}
function initConfigLocation()
{
    for (let i = 0; i < Object.entries(AppData.SteamCloudLocations).length; i++) {
        let loc = Object.entries(AppData.SteamCloudLocations)[i]
        if (!fs.existsSync(loc[1])) {
            fs.mkdirSync(loc[1], { recursive: true })
        }
    }
}
global.AppData.Keybinder = new KeybindManager()
global.AppData.MetricManager = new MetricManager()
initSteamworks()
initConfigLocation()


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

global.AppData.notifyProc({
    eventName: 'awake',
    data: Date.now()
})


