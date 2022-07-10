import {EventEmitter} from 'events'

export default class Steamworks extends EventEmitter{
    static AppID = 1992810
    static MetricUpdateInterval = 15000
    constructor() {
        super(); this.setMaxListeners(8192)
        this.Greenworks = require('greenworks')
    }
    Greenworks = null
    hasInitalized = false
    GenerateError(thing) {
        this.emit('error', thing)
        return new Error(`[Steamworks->${thing.id}] ${thing.message}`)
    }
    Initalize() {
        if (this.hasInitalized) return
        let response = this.Greenworks.init(Steamworks.AppID)
        if (response) {
            this.InitalizeEvents()
            this.constantInterval = setInterval(() => {
                this.emit('update', this.Greenworks)
            }, Steamworks.MetricUpdateInterval)
        } else {
            throw this.GenerateError(Steamworks.ERRORS.InitalizeFail)
        }
    }
    InitalizeEvents() {
        if (this.hasInitalized) return
        let targets = [
            'download_completeCount'
        ]
        for (let i = 0; i < targets.length; i++) {
            this.on('update', (steamworks) => {
                this.Metrics[targets[i]] = this.Metrics[targets[i]].process(steamworks, this.Metrics[targets[i]], targets[i])
            })
        }
    }
    ResetMetrics() {
        let entries = Object.entries(this.Metrics)
        for (let i = 0; i < entries.length; i++) {
            let pair = entries[i]

            if (pair.type == 'int') {
                this.Greenworks.setStatInt(pair.name, pair.default)
            } else if (pair.type == 'float') {
                this.Greenworks.setFloatInt(pair.name, pair.default)
            }
        } 
    }
    Metrics = {
        download_completeCount: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            name: 'stat_count_downloadpost',
            increment: true,
            type: 'int',
            process: (steamworks, scope, key) => {
                console.log(steamworks)
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
        }
    }
    static ERRORS = {
        InitalizeFail: {
            message: 'Failed to initalize Steamworks API',
            id: 'InitalizeFail'
        }
    }
}