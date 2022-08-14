import {EventEmitter} from 'events'

export default class Steamworks extends EventEmitter{
    static AppID = 1992810
    static MetricUpdateInterval = 15000
    constructor() {
        super(); this.setMaxListeners(8192)
    }
    Greenworks = null
    hasInitalized = false
    GenerateError(thing) {
        this.emit('error', thing)
        return new Error(`[SteamworksIntergration->${thing.id}] ${thing.message}`)
    }
    Initalize() {
        if (this.hasInitalized) return
        var gw = require('greenworks')
        let response = gw.init()
        if (response) {
            this.hasInitalized = true
            this.InitalizeToken(gw)
            console.debug(`[SteamworksIntergration->Initalize] Success!`)
            this.InitalizeEvents()
            this.constantInterval = setInterval(() => {
                this.emit('update', gw)
            }, Steamworks.MetricUpdateInterval)
        } else {
            this.hasInitalized = true
            console.debug(`[SteamworksIntergration->Initalize] Failed ;w;`)
            throw this.GenerateError(Steamworks.ERRORS.InitalizeFail)
        }
        this.Greenworks = gw
    }
    AuthorizationToken = ""
    InitalizeToken(greenworks)
    {
        if (!this.hasInitalized)
            this.Initalize()
        console.log(`[SteamworksIntergration->InitalizeToken] Fetching Token`)
        var response = greenworks.getEncryptedAppTicket('', (ticket) => {
            this.AuthorizationToken = ticket.toString('hex');
            console.log(`[SteamworksIntergration->InitalizeToken] We've got the token!!`)
        }, (err) => {
            console.error(`[SteamworksIntergration->InitalizeToken] Failed!!\n`, err)
            if (err.includes('Error on getting encrypted app ticket.')) {
                console.log(`[SteamworksIntergration->InitalizeToken] Retrying in 60s`)
                setTimeout(this.InitalizeToken(greenworks), 60000)
            }
        })
        console.debug(`[SteamworksIntergration->InitalizeToken] response:`, response)
    }
    InitalizeEvents() {
        if (this.hasInitalized) return
        let targets = [
            'download_completeCount',
            'uncaughtException',
            'favorite_count'
        ]
        for (let i = 0; i < targets.length; i++) {
            if (this.Metrics[targets[i]].process == undefined)
                this.Metrics[targets[i]].process = Steamworks.MetricsDefault
            this.on('update', (steamworks) => {
                this.Metrics[targets[i]] = this.Metrics[targets[i]].process(steamworks, this.Metrics[targets[i]], targets[i])
            })
        }
    }
    ResetMetrics() {
        let entries = Object.entries(this.Metrics)
        for (let i = 0; i < entries.length; i++) {
            let pair = entries[i]
            if (pair.incrementOnly) continue
            if (pair.type == 'int') {
                this.Greenworks.setStatInt(pair.name, pair.default)
            } else if (pair.type == 'float') {
                this.Greenworks.setFloatInt(pair.name, pair.default)
            }
        } 
    }
    static MetricsDefault = (steamworks, scope, key) => {
        if (scope.value > 0) {
            let currentCount = 0
            if (scope.type == 'int')
                currentCount = steamworks.getStatInt(scope.name)
            else if (scope.type == 'float')
                currentCount = steamworks.getStatFloat(scope.name)
            
            let targetValue = currentCount
            if (scope.increment) {
                targetValue = currentCount + scope.value
                scope.value = 0
            } else {
                targetValue = scope.value
            }
            let didError = false
            try {
                steamworks.setStat(scope.name, targetValue)
            } catch (err) {
                console.error(`[SteamworksIntergration->Update] Failed to increment stat ${scope.name}\n`, err)
                didError = true
            }
            if (!didError) {
                console.debug(`[SteamworksIntergration->Update] Incremented stat (${scope.type}) to ${targetValue} (was ${currentCount})`)
            }
        }
        return scope
    }
    Metrics = {
        download_completeCount: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_downloadpost',
            increment: true,
            type: 'int'
        },
        uncaughtException: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_uncaughtException',
            increment: true,
            type: 'int'
        },
        favorite_count: {
            min: 0,
            max: 0,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postFavorite',
            increment: true,
            type: 'int'
        }
    }
    static ERRORS = {
        InitalizeFail: {
            message: 'Failed to initalize Steamworks API',
            id: 'InitalizeFail'
        }
    }
}