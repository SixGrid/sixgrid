const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ConfigManager = require('./ConfigManager').default
const esixapi = require('esix-api')
const EventEmitter = require('events')

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
        global.AppData.Client = new esixapi.Client(Object.assign({}, AppData.Config.Data.clientParameters))
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
    }
}
global.AppData = AppData
global.AppData.Config = new ConfigManager()
