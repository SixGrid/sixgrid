class Gatekeeper extends EventEmitter {
    /**
     * @param {Client} client 
     */
    constructor(client) {
        this.Client = client
    }

    /**
     * @type {Client}
     * @default null
     */
    Client = null
}
module.exports = Gatekeeper