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
        if (arguments.length == 1)
        {
            this._data = arguments[0]
        } else {
            this._data[key] = value
        }
        this.write()
    }

    default(target) {
        if (this._data == null)
            this._data = {}
        this._data = {
            ...target,
            ...this._data,
        }
        this.write()
    }
}