const EventEmitter = require('events')
const https = require('https')

/** @extends {node:events} */
class AuthR extends EventEmitter {
	/**
	 * @param {string} username e621 Username
	 * @param {string} apikey e621 API Key
	 */
	constructor(username, apikey) {
		super();
		if (username == undefined) throw new Error("Missing Required Option `username`");
		if (typeof username != "string") throw new Error("Invalid Type for Required Option `username`");
		if (apikey == undefined) throw new Error("Missing Required Option `apikey`");
		if (typeof apikey != "string") throw new Error("Invalid Type for Required Option `apikey`");

		this.Username = username;
		this.APIKey = apikey;
	}

	Validate() {

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
}
module.exports = AuthR;