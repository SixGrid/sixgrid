const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ConfigManager = require('./ConfigManager').default
const esixapi = require('libsixgrid')
const EventEmitter = require('events')
const {default: Configuration} = require('./Configuration')
const { default: Steamworks } = require('./SteamworksIntergration')
const request = require('request')
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
var AppData = {
    ApplicationIdentifier: 'sixgrid',
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
        global.AppData.Client = new esixapi.Client(currentAuthentication)
        global.AppData.Client.on('post:favorite', () => {
            AppData.Steamworks.Metrics.favorite_count.value++
        })
        global.AppData.Client.on('post:vote', (data) => {
            if (data.state > 0)
                AppData.Steamworks.Metrics.post_upvote_count++
            else if (data.state < 0)
                AppData.Steamworks.Metrics.post_downvote_count++
        })
        global.AppData.Client.on('post:search', () => {
            AppData.Steamworks.Metrics.search_count++
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
        let out = fs.createWriteStream(path.join(AppData.CloudConfig.UserConfiguration.get().downloadFolder, `${postObject.ID}.${postObject.Image.File.md5}.${postObject.Image.File.ext}`))

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
            AppData.CloudConfig.Statistics._data.downloadCount++
            AppData.CloudConfig.Statistics.write()
            if (AppData.CloudConfig.UserConfiguration.saveMetadata) {
                let loc = path.join(AppData.CloudConfig.UserConfiguration.get().downloadFolder, `${postObject.ID}.${postObject.Image.File.md5}.json`)
                if (!fs.existsSync(loc)) {
                    fs.writeFileSync(loc, JSON.stringify(postObject.toJSON(), null, '    '))
                    console.log(`[AppData->PostDownload] Saved metadata for post ${postObject.ID}`)
                }
            }
            console.log(`[AppData->PostDownload] Completed ${postObject.ID}.${postObject.Image.File.ext} (${parseFloat(totalBytes/1000).toFixed(3)}kb)`)
            AppData.Steamworks.Metrics.download_completeCount.value++
        })
    },

    FetchClientParameters () {
        let currentAuthentication = global.AppData.CloudConfig.Authentication.get('_current')
        return global.AppData.CloudConfig.Authentication.get().items[currentAuthentication]
    },

    SteamCloudLocations: {
        Config: path.join(process.cwd(), 'AppConfig')
    },

    CloudConfig: {}
}
global.AppData = AppData
global.AppData.Config = new ConfigManager()
// global.AppData.Steamworks = new (require('@theace0296/steamworks'))(1992810)
global.AppData.Steamworks = new Steamworks()
setTimeout(() =>{global.AppData.Steamworks.Initalize()}, 1500)

for (let i = 0; i < Object.entries(AppData.SteamCloudLocations).length; i++) {
    let loc = Object.entries(AppData.SteamCloudLocations)[i]
    if (!fs.existsSync(loc[1])) {
        fs.mkdirSync(loc[1], { recursive: true })
    }
}

let configStoreFiles = [
    ['authProfile.json', 'Authentication', {
        items: [
            {
                auth: {
                    login: '',
                    apikey: '',
                    enabled: false
                },
                endpoint: 'https://e926.net'
            },
            {
                auth: {
                    login: '',
                    apikey: '',
                    enabled: false
                },
                endpoint: 'https://e621.net'
            }
        ],
        _current: 0
    }],
    ['config.json', 'UserConfiguration', {
        media: {
            autoplay: true,
            loop: true
        },
        downloadFolder: path.join(require('electron').remote.app.getPath('downloads'), 'sixgrid'),
        saveMetadata: false,
        tagBlacklist: [],
        ratingFilter: 'none',
        preloadPageCount: 1,
        preloadStartIndex: 0
    }],
    ['stats.json', 'Statistics', {
        downloads: 0
    }]
]

for (let i = 0; i < configStoreFiles.length; i++) {
    let location = path.join(AppData.SteamCloudLocations.Config, configStoreFiles[i][0])

    if (!fs.existsSync(location)) {
        fs.writeFileSync(location, JSON.stringify(configStoreFiles[i][2]))
    }
    global.AppData.CloudConfig[configStoreFiles[i][1]] = new Configuration(location)
    global.AppData.CloudConfig[configStoreFiles[i][1]].default(configStoreFiles[i][2])
    global.AppData.CloudConfig[configStoreFiles[i][1]].write()
}
