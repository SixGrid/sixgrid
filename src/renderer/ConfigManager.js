const EventEmitter = require('events')
const fs = require('fs')
const path = require('path')
const electron = require('electron')
/**
 * @class
 * @extends node:events
 */
class ConfigManager extends EventEmitter {
    constructor() {
        super()
    }

    get Directory () {
        let value = path.join(electron.remote.app.getPath('userData'), AppData.ApplicationIdentifier, 'config')
        if (!fs.existsSync(value))
            fs.mkdirSync(value, {recursive: true})
        return value
    }
    get Location () {
        return path.join(this.Directory, 'config-current.json')
    }

    Data = {

    }

    validateLocation() {
        if (!fs.existsSync(this.Directory))
            fs.mkdirSync(this.Directory, {recursive: true})
        if (!fs.existsSync(this.Location))
            fs.writeFileSync(this.Location, '{}')
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
        this.emit('writeAfter', this)
        return this.Data
    }
}
export default ConfigManager