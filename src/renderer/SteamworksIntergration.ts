import * as greenworks from 'greenworks'

import {EventEmitter} from 'events'

export type SteamMetricType = 'int'
export interface ISteamMetric
{
    min: number,
    max: number,
    default: number,
    value: number,
    incrementOnly: boolean,
    name: string,
    increment: boolean,
    type: SteamMetricType
    process?: SteamMetricProcess
}
export type SteamMetricProcess = (steamworks: typeof greenworks, scope: any, key: string) => any

export default class Steamworks extends EventEmitter {
    public static AppID = 1992810
    public static MetricUpdateInterval = 15000
    public Greenworks: typeof greenworks
    public constantInterval?: NodeJS.Timeout
    constructor() {
        super(); this.setMaxListeners(8192)
        this.Greenworks = require('greenworks')
    }
    hasInitalized = false
    GenerateError(thing: any) {
        this.emit('error', thing)
        return new Error(`[Steamworks->${thing.id}] ${thing.message}`)
    }
    Initalize() {
        if (this.hasInitalized) return
        let response = this.Greenworks.init()
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
            'download_completeCount',
            'uncaughtException',
            'favorite_count'
        ]
        for (let i = 0; i < targets.length; i++) {
            if (this.Metrics[targets[i]].process == undefined)
                this.Metrics[targets[i]].process = Steamworks.MetricsDefault
            this.on('update', (steamworks) => {
                let t = this.Metrics[targets[i]]
                if (t.process != undefined)
                    t.process(steamworks, this.Metrics[targets[i]], targets[i])
            })
        }
    }
    ResetMetrics() {
        let entries = Object.entries(this.Metrics)
        for (let i = 0; i < entries.length; i++) {
            let pair = entries[i]
            if (pair[1].incrementOnly) continue
            if (pair[1].type == 'int') {
                this.Greenworks.setStatInt(pair[1].name, pair[1].default)
            } else if (pair[1].type == 'float') {
                this.Greenworks.setFloatInt(pair[1].name, pair[1].default)
            }
        } 
    }
    static MetricsDefault = (steamworks: typeof greenworks, scope: any, key: string) => {
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
    Metrics: {[key: string]: ISteamMetric} = {
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
        },
        search_count: {
            min: 0,
            max: 0,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_query',
            increment: true,
            type: 'int'
        },
        post_downvote_count: {
            min: 0,
            max: 0,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postdownvote',
            increment: true,
            type: 'int'
        },
        post_upvote_count: {
            min: 0,
            max: 0,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postupvote',
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