const fs = require('fs')
const path = require('path')

export default class Configuration {
    constructor(location) {
        this.Location = path.resolve(location)
        this.read()
    }

    _data = null

    read() {
        let data = fs.readFileSync(this.Location).toString()
        this._data = JSON.parse(data)
    }
    write() {
        let stringify = JSON.stringify(this._data)
        fs.writeFileSync(this.Location, stringify)
    }

    get(key) {
        if (key == undefined)
            return Object.assign({}, this._data)
        return this._data[key]
    }
    set(key, value) {
        this._data[key] = value
        this.write()
    }

    default(target) {
        this._data = AppData.DeepAssign({}, JSON.parse(JSON.stringify(this._data)), target)
    }
}