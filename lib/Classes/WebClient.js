const EventEmitter = require('events');
const https = require("https")
const packageJSON = require("./../package.json")
const URL = require('./URL')
const zlib = require('zlib')

/** 
 * @extends node:events
 * @requires node:https
 */
class WebClient extends EventEmitter {
    /** 
     * @param {Client} client
     * @param {type$WebClient.Options} options
     */
    constructor(client, options) {
        super();
        this.Client = client;
        if (options == undefined || typeof options != "object") throw new Error("WebClient Options undefined or wrong type");
        if (options.Auth == undefined || typeof options.Auth != "object") throw new Error("WebClient Authentication undefined or wrong type");
        if (options.Auth._type == undefined || typeof options.Auth._type != "string" || options.Auth._type != "AuthR") throw new Error("WebClient Authentication invalid");

        // Merge `this.Headers` into `options.Headers`
        this.Headers = Object.fromEntries(
            Object.entries(options.Headers || []).concat(Object.entries(this.Headers))
        )
        // Force User-Agent header to be in our format :p
        this.Headers['User-Agent'] = `esix-api/${this.Client.Product.version} (by bjorkin on e621)`
        this.Auth = options.Auth;
        this.BaseURL = options.BaseURL || this.BaseURL;
    }

    /**
     * @type {Object<string, object>}
     * @property {string} User-Agent Default Value `esix-api/0.x.x (by bjorkin on e621)`
     * @description Headers that get merged with the default node:https request headers.
     */
    Headers = {
        "User-Agent": `esix-api/0.x.x (by bjorkin on e621)`,
        "Accept-Encoding": `gzip, deflate`
    }

    /**
     * @type {string}
     * @default https://e621.net
     */
    BaseURL = "https://e621.net";

    /**
     * @type {AuthR}
     * @default null
     */
    Auth = null;

    /**
     * 
     * @param {node:http.request#options} options 
     * @param {function} resolve 
     * @param {function} reject 
     * @returns {node:http.ClientRequest}
     */
    request(options, resolve, reject) {
        if (options.path.toString().includes("?")) {
            options.path = `${options.path}&${this.Auth.toString()}`;
        } else {
            options.path = `${options.path}?${this.Auth.toString()}`;
        }
        options = Object.assign({}, options)
        return https.request(options, (response) => {
            const { statusCode } = response;
            const contentType = response.headers["content-type"];

            let error;

            if (statusCode != 200) {
                error = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            }
            if (error) {
                response.error = error;
            } else {
                response.error = null;
            }

            let lstn = response

            if (response.headers['content-encoding'] == 'br') {
                lstn = zlib.createBrotliDecompress()
                response.pipe(lstn)
            } else if (response.headers['content-encoding'] == 'gzip') {
                lstn = zlib.createGunzip()
                response.pipe(lstn)
            }
            let rawData = '';
            lstn.on('data', (chunk) => {rawData+=chunk});
            /* lstn.on('end', () => {
                console.log(rawData)
            }) */
            lstn.on('end', () => {
                // console.log(response.headers)
                response.toJSON = () => {
                    try {
                        return JSON.parse(rawData)
                    } catch(e) {
                        return {};
                    }
                }
                response.data = rawData;

                let failParse = false;
                try {
                    const parsedData = JSON.parse(rawData);
                } catch(e) {
                    failParse = true;
                }
                if (!failParse) {
                    response.data = JSON.parse(rawData);
                }
                response.isJSON = !failParse;
                resolve(response);
            })
        });
    }

    /**
     * @param {string} url 
     * @param {string|Object} [data={}]
     * @returns {node:http.ClientRequest}
     */
    post(url, data) {
        // If the url does not start with `http`/`https`, prepend `this.BaseURL`
        if (url.match(/^http(s)/g) == null) url = this.BaseURL + url;

        let postData = "";
        if (data != undefined && typeof data == "object") {
            postData = "";
            let oe = Object.entries(data);
            for (let i = 0; i < oe.length; i++) {
                postData += `${oe[i][0]}=${encodeURIComponent(oe[i][1].toString())}`;
                if (i != oe.length - 1) postData += "&";
            }
        } else {
            postData = data || "";
        }

        url = new URL(url.toString());

        var requestOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: "POST",
            headers: this.Headers
        }
        requestOptions["Content-Type"] = "application/x-www-form-urlencoded";
        requestOptions["Content-Length"] = postData.length;
        let self = this;
        return new Promise((resolve, reject) => {
            const req = self.request(requestOptions, resolve, reject);
            req.on('error', reject);
            req.write(postData);
            req.end();
        })
    }

    /**
     * @param {string} url 
     * @param {string|Object} [data={}]
     * @returns {node:http.ClientRequest}
     */
    delete(url, data) {
        // If the url does not start with `http`/`https`, prepend `this.BaseURL`
        if (url.match(/^http(s)/g) == null) url = this.BaseURL + url;

        let postData = "";
        if (data != undefined && typeof data == "object") {
            postData = "";
            let oe = Object.entries(data);
            for (let i = 0; i < oe.length; i++) {
                postData += `${oe[i][0]}=${encodeURIComponent(oe[i][1].toString())}`;
                if (i != oe.length - 1) postData += "&";
            }
        } else {
            postData = data || "";
        }

        url = new URL(url.toString());

        var requestOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: "DELETE",
            headers: this.Headers
        }
        requestOptions["Content-Type"] = "application/x-www-form-urlencoded";
        requestOptions["Content-Length"] = postData.length;
        let self = this;
        return new Promise((resolve, reject) => {
            const req = self.request(requestOptions, resolve, reject);
            req.on('error', reject);
            req.write(postData);
            req.end();
        })
    }

    /**
     * @param {string} url 
     * @async
     * @returns {node:http.ClientRequest}
     */
    get(url) {
        // If the url does not start with `http`/`https`, prepend `this.BaseURL`
        if (url.match(/^http(s)/g) == null) url = this.BaseURL + url;

        url = new URL(url.toString());
        var requestOptions = {
            hostname: url.hostname,
            port: url.port,
            path: url.path,
            method: "GET",
            headers: this.Headers
        }

        let self = this;
        return new Promise((resolve, reject) => {
            const req = self.request(requestOptions, resolve, reject);
            req.on('error', reject);
            req.end();
        })
    }
}
module.exports = WebClient;