const EventEmitter = require('events');
const http = require("https")
const packageJSON = require("./../package.json")

/** @extends {node:events} */
class WebClient extends EventEmitter {
	/** @param {options} WebClient.Options */
	constructor(options) {
		super();
		this.Options = options;
	}

	/**
	 * @typedef {Object<string, bool>} WebClient.Options
	 * @property {AuthR} Auth
	 * @property {string} BaseURL=https://e621.net/
	 * @property {Object<string, string>} Header Headers sent with requests
	 * @property {string} Header.User-Agent="esix-api/0.3.0(kate@dariox.club)"
	 */
	/** @type {WebClient.Options} */
	Options = {};

	/**
	 * @type {Object<string, object>}
	 * @property {string} User-Agent Default Value `sixgrid/0.x.x (kate@dariox.club)`
	 */
	Headers = {
		"User-Agent": `${packageJSON.name}/${packageJSON.version} (kate@dariox.club)`
	}

	get(url) {
		if (url.toString().includes("?")) {
			url += "&" + this.Auth.toString();
		} else {
			url += "?" + this.Auth.toString();
		}

		if (url.match(/^http(s)/g).length < 0) url = this.BaseURL + url;
	}
}
module.exports = WebClient;