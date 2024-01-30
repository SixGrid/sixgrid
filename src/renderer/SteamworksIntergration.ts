import * as greenworks from 'steamworks.js'
import type gwt from 'steamworks.js'

import {EventEmitter} from 'events'
import { MetricManagerData } from './MetricManager'
import * as ElectronLog from 'electron-log'
let log: ElectronLog.LogFunctions;
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
    public Greenworks: gwt.Client
    public constantInterval?: NodeJS.Timeout
    constructor() {
        super(); this.setMaxListeners(8192)
        log = global.AppData.Log.scope('steamworks')
        this.Greenworks = require('steamworks.js')
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
            log.debug('Disabled')
            return
        }
        if (this.hasInitalized) return
        try {
            let tmp = greenworks.init(1992810)
            this.Greenworks = tmp as any
        } catch (e) {
            if (require('@electron/remote').process.argv.includes('--steam'))
                alert('Failed to initalize Steamworks\n' + e)
            log.error(`Failed to initialize Steamworks`, e)
            return;
        }
        this.InitializeEvents()
    }
    InitializeEvents() {
        if (this.hasInitalized) return

        // Fetch all items
        let metricdata = global.AppData.MetricManager.GetAll()
        for (let pair of Object.entries(metricdata))
        {
            let newValue: number|null = null
            if (pair[1].type == 'int') {
                newValue = this.Greenworks.stats.getInt(pair[1].name)
            }
            else if (pair[1].type == 'float') {
                newValue = this.Greenworks.stats.getInt(pair[1].name)
            }
            if (newValue != null)
                metricdata[pair[0]].value = newValue
        }
        global.AppData.MetricManager.SetData(metricdata)
        global.AppData.MetricManager.Write()

        var scope = this
        global.AppData.MetricManager.on('update', function (data: ISteamMetric)
        {
            scope.Greenworks.stats.setInt(data.name, data.value)
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