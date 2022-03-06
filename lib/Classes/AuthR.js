const EventEmitter = require('events')
const https = require('https')
const Schema = require("./_Schema")

/** @extends {node:events} */
class AuthR extends EventEmitter {
    _type = "AuthR";

    /**
     * @param {Client} client
     * @param {type$AuthR.JSON} options e621 Username
     */
    constructor(client, options) {
        super();
        this.Client = client;
        let options_validate = this.Client.Validator.validate(options, Schema["type$AuthR.JSON"], {required: true});
        if (!options_validate.valid) options_validate.errors.foreach(e => {throw new Error(e)});

        this.Username = options.login;
        this.APIKey = options.apikey;
        this.#_store = Object.assign({}, options)
    }

    #_store = {
        enable: false,
        username: "",
        apikey: ""
    };

    /**
     * @event AuthR#changed
     * @type {Object} 
     * @property {string} name `AuthR` property that was changed.
     */

    /** 
     * @fires AuthR#changed
     * @type {bool}
     * @default false
     */
    get Enable()  { return this.#_store.enable; }
    set Enable(v) { 
        if (typeof v != "boolean") throw new Error("Invalid Type");
        this.#_store.enable = v; 
        this.emit('change', {name: 'enable'}); }

    /**
     * @fires AuthR#changed
     * @type {string}
     */
    get Username()  { return this.#_store.username; }
    set Username(v) { 
        if (typeof v != "string") throw new Error("Invalid Type")
        this.#_store.username = v; 
        this.emit('change', {name: 'username'}); }

    /**
     * @fires AuthR#changed
     * @type {string}
     */
    get APIKey()  { return this.#_store.apikey; }
    set APIKey(v) { 
        if (typeof v != "string") throw new Error("Invalid Type");
        this.#_store.apikey = v; 
        this.emit('change', {name: 'apikey'}); }

    /**
     * @returns {string} Returns data formatted as `login=${this.Username}&api_key=${this.APIKey}` to inject into the HTTP Request parameters when {@link AuthR.Enable} is `true`. When {@link AuthR.Enable} is false an empty string is returned.
     */
    toString() {
        if (!this.Enable) return "";
        return `login=${this.Username}&api_key=${this.APIKey}`;
    }

    /**
     * @returns {type$AuthR.JSON}
     */
    toJSON() {
        if (!this.Enable) return {enabled: false, login: null, apikey: null}
        return {
            enabled: this.Enable,
            login: this.Username,
            apikey: this.APIKey,
        }
    }
}
module.exports = AuthR;