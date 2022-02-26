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

	/**
	 * @param {int} post_id 
	 * @param {boolean} status 
	 * @async
	 */
	async Favorite(post_id, status) {
		if (status) {
			await this.WebClient.post('/favorites.json', `post_id=${post_id}`)
		} else {
			await this.WebClient.delete(`/favorites/${post_id}.json`);
		}
	}

	/**
	 * @type {Object}
	 * @property {Object} Search
	 * @property {String} Search.query
	 * @property {Number} Search.page
	 * @property {Number} Search.limit
	 * @property {String} Search.extraParameters
	 */
	DefaultOptions = {
		Search: {
			query: '',
			page: 1,
			limit: 320,
			extraParameters: ''
		}
	}

	/**
	 * @param {Client.DefaultOptions.Search} options 
	 * @returns {Array.<PostObject>
	 */
	async Search(options) {
		if (options == undefined || typeof options != 'object') options = {};
		options = Object.assign({}, DefaultOptions.Search, options);
		
		let response = null
		try {
			response = await this.WebClient.get(`${this.Endpoint}/posts.json?query=${encodeURIComponent(options.query)}&page=${options.page}&limit=${options.limit}${extraParameters}`)
		} catch (error) {
			throw error;
		}
		if (response.error == null)
			throw response.error;

		let json = response.toJSON();

		if (json.posts.length < 0) return [];

		let returnData = [];

		for (let i = 0; i < json.posts.length; i++) {
			returnData.push(new PostObject(json.posts[i]));
		}

		return returnData;
	}

	/**
	 * @type {Object}
	 * @see https://github.com/tdegrunt/jsonschema
	 */
	Validator = null;

	/** 
	 * @type {AuthR} 
	 * @default null
	 */
	Auth = null;

	/** 
	 * @type {boolean}
	 * @default false 
	 */
	DeveloperMetrics = false;

	/** 
	 * @type {string} 
	 * @default https://e621.net
	 */
	Endpoint = "https://e621.net";
}
module.exports = Client;