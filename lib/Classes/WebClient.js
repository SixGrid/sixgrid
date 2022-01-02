const EventEmitter = require('events');

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
}
module.exports = WebClient;