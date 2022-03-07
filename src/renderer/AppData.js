const electron = require('electron')
const fs = require('fs')
const path = require('path')
const ConfigManager = require('./ConfigManager').default
const esixapi = require('esix-api')

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
    }
}
global.AppData = AppData
global.AppData.Config = new ConfigManager()
