const EventEmitter = require('events')
const jsonschema = require('jsonschema');
const AuthR = require('./AuthR');
const Schema = require("./_Schema")
const packageJSON = require("./../package.json");
const WebClient = require('./WebClient');
const PostObject = require('./Post')

/** @extends {node:events} */
class Client extends EventEmitter {
    /**
     * @param {type$Client.Options} options 
     */
    constructor(options) {
        super();
        if (options == undefined || typeof options != 'object') options = {};
        options = Object.assign({}, {
            product: {
                name: packageJSON.name,
                version: packageJSON.version
            },
            auth: null,
            developermetrics: false,
            endpoint: 'https://e621.net'
        }, options)
        this.Validator = this.#SetupValidator();

        let options_validate = this.Validator.validate(options, Schema["type$Client.Options"], {required: true});
        if (!options_validate.valid) options_validate.errors.foreach(e => {throw new Error(e)});

        this.Auth = new AuthR(this, options.auth);
        this.DeveloperMetrics = options.developermetrics;
        this.Product = options.product;
        this.Endpoint = options.endpoint;

        this.WebClient = new WebClient(this, {
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
     * @type {Object<String, PostObject>} - Key is the Post ID
     */
    PostCache = {}

    /**
     * @param {Client.DefaultOptions.Search} options 
     * @returns {Array.<PostObject>
     */
    async Search(options) {
        if (options == undefined || typeof options != 'object') options = {};
        options = Object.assign({}, this.DefaultOptions.Search, options);
        
        let response = null
        try {
            response = await this.WebClient.get(`${this.Endpoint}/posts.json?query=${encodeURIComponent(options.query)}&page=${options.page}&limit=${options.limit}${options.extraParameters}`)
        } catch (error) {
            throw error;
        }
        if (response.error != null)
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