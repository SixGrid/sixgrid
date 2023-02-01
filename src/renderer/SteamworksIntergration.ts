import * as greenworks from 'greenworks'

import {EventEmitter} from 'events'
import { MetricManagerData } from './MetricManager'

export type SteamMetricType = 'int'|'float'
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
        alert(thing.message)
        return new Error(`[Steamworks->${thing.id}] ${thing.message}`)
    }
    Initialize() {
        if (!AppData.AllowSteamworks)
        {
            console.debug(`Steamworks is disabled.`)
            return
        }
        if (this.hasInitalized) return
        try {
            let response = this.Greenworks.init()
            if (response) {
                this.InitializeEvents()
            } else {
                throw this.GenerateError(Steamworks.ERRORS.InitalizeFail)
            }
        } catch (e) {
            if (require('electron').remote.process.argv.includes('--steam'))
                alert('Failed to initalize Steamworks\n' + e)
            console.error(`Failed to initialize Steamworks`, e)
        }
    }
    InitializeEvents() {
        if (this.hasInitalized) return

        // Fetch all items
        let metricdata = global.AppData.MetricManager.GetAll()
        for (let pair of Object.entries(metricdata))
        {
            let newValue: number|null = null
            if (pair[1].type == 'int') {
                newValue = this.Greenworks.getStatInt(pair[1].name)
            }
            else if (pair[1].type == 'float') {
                newValue = this.Greenworks.getStatFloat(pair[1].name)
            }
            if (newValue != null)
                metricdata[pair[0]].value = newValue
        }
        global.AppData.MetricManager.SetData(metricdata)
        global.AppData.MetricManager.Write()

        let greenworks = this.Greenworks
        global.AppData.MetricManager.on('update', function (data: ISteamMetric)
        {
            greenworks.setStat(data.name, data.value)
        })
    }
    ResetMetrics() {
        global.AppData.MetricManager.Reset()
    }
    static ERRORS = {
        InitalizeFail: {
            message: 'Failed to initalize Steamworks API',
            id: 'InitalizeFail'
        }
    }
}