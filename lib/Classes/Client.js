const EventEmitter = require('events')

/** @extends {node:events} */
class Client extends EventEmitter {
	/**
	 * @param {type$Client.Options} options 
	 */
	constructor(options) {
		super();
	}
}
module.exports = Client;