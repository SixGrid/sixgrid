const EventEmitter = require('events')
const jsonschema = require('jsonschema');
const AuthR = require('./AuthR');
const Schema = require("./_Schema")
const packageJSON = require("./../package.json");
const WebClient = require('./WebClient');

/** @extends {node:events} */
class Client extends EventEmitter {
	/**
	 * @param {type$Client.Options} options 
	 */
	constructor(options) {
		super();
		this.Validator = this.#SetupValidator();

		let options_validate = this.Validator.validate(options, Schema["type$Client.Options"], {required: true});
		if (!options_validate.valid) options_validate.errors.foreach(e => {throw new Error(e)});

		this.Auth = new AuthR(options.auth);
		this.DeveloperMetrics = options.developermetrics || false;
		this.Product = options.product || {
			name: packageJSON.name,
			version: packageJSON.version
		};
		this.Endpoint = options.endpoint || "https://e621.net"

		this.WebClient = new WebClient({
			Auth: this.Auth,
			BaseURL: this.Endpoint
		});
	}

	/**
	 * @private
	 * @returns {Object} module:jsonschema Validator Instance
	 */
	#SetupValidator() {
		let v = new jsonschema.Validator();
		let schemes = require('./_Schema');
		let objs = Object.entries(schemes);
		for (let i = 0; i < objs.length; i++) {
			v.addSchema(objs[i][1], objs[i][1].id);
		}
		return v;
	}
}
module.exports = Client;