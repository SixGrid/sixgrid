const fs = require('fs')
const path = require('path')

export interface IConfiguration<T>
{
    Location: string
    _data: T

    read(): void
    write(): void

    get(key: string): any
    set(key: string, value: any): void

    default(data: T): void
}
export default class Configuration implements IConfiguration<{[key: string]: any}> {
    public Location: string
    constructor(location: string) {
        this.Location = path.resolve(location)
        this.read()
    }

    public _data: {[key: string]: any} = {}

    read() {
        let data = fs.readFileSync(this.Location).toString()
        this._data = JSON.parse(data)
    }
    write() {
        let stringify = JSON.stringify(this._data)
        fs.writeFileSync(this.Location, stringify)
    }

    get(key: string): any {
        if (key == undefined)
            return Object.assign({}, this._data)
        return this._data[key]
    }
    set(key: string, value: any) {
        if (arguments.length == 1)
        {
            this._data = arguments[0]
        } else {
            this._data[key] = value
        }
        this.write()
    }

    default(target: any) {
        if (this._data == null)
            this._data = {}
        this._data = {
            ...target,
            ...this._data,
        }
        this.write()
    }
}