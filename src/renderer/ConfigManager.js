const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const electron = require('electron')
let log;
/**
 * @class
 * @extends node:events
 */
class ConfigManager extends EventEmitter {
    constructor() {
        super()
        log = global.AppData.Log.scope('configManager')
        this.read()
    }

    get Directory () {
        let value = path.join(require('@electron/remote').app.getPath('userData'), AppData.ApplicationIdentifier, 'config')
        if (!fs.existsSync(value))
            fs.mkdirSync(value, {recursive: true})
        return value
    }
    get Location () {
        return path.join(this.Directory, 'config-current.json')
    }

    _unsavedChanges = false
    get unsavedChanges () { return this._unsavedChanges }
    set unsavedChanges (value) { log.log(`[configManager->unsavedChanges] ${this._unsavedChanges} -> ${value}`); this._unsavedChanges = value}

    unsavedChanges = false

    _data = {
        clientParameters: {
            auth: {
                user: '',
                apikey: '',
                enable: false
            },
            endpoint: 'https://e926.net',
            developermetrics: false
        }
    }
    get Data() { return this._data }
    set Data(value) { this._data = value; this.unsavedChanges = true }

    validateLocation() {
        if (!fs.existsSync(this.Directory))
            fs.mkdirSync(this.Directory, {recursive: true})
        if (!fs.existsSync(this.Location))
            fs.writeFileSync(this.Location, JSON.stringify(this.Data))
    }

    read() {
        this.validateLocation()

        let data = fs.readFileSync(this.Location)
        data = data.toString()

        try {
            this.Data = Object.assign(JSON.parse(data))
        } catch (error) {
            this.emit('error', { error, label: `Failed to read config at; '${this.Location}'`})
            throw error
        }
        this.emit('readAfter', this)
        return this.Data
    }
    write() {
        this.validateLocation()

        let data = JSON.stringify(Object.assign({}, this.Data))

        try {
            fs.writeFileSync(this.Location, data)
        } catch (error) {
            this.emit('error', { error, label: `Failed to write config at; '${this.Location}'`})
            throw error
        }
        this.unsavedChanges = false
        this.emit('writeAfter', this)
        return this.Data
    }
}
export default ConfigManager