const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ConfigManager = require('./ConfigManager').default
const esixapi = require('libsixgrid')
const EventEmitter = require('events')
const {default: Configuration} = require('./Configuration')
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
        global.AppData.Client = new esixapi.Client(currentAuthentication)
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
        }
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
