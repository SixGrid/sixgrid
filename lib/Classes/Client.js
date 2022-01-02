const EventEmitter = require('events')

/** @extends {node:events} */
class Client extends EventEmitter {
	/**
	 * @param {type$~AuthOptions} authOptions 
	 */
	constructor(options) {
		super();
	}
}
module.exports = Client;