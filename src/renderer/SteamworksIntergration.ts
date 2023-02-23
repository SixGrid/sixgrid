import * as greenworks from 'greenworks'

import {EventEmitter} from 'events'
import { MetricManagerData } from './MetricManager'
import { ipcRenderer } from 'electron'

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
            let gw = require('greenworks')
            eval(`process.activateUvLoop()`)
            let response = gw.init()
            if (response) {
                this.InitalizeToken(gw)
                this.Greenworks = gw
                this.InitializeEvents()
            } else {
                throw this.GenerateError(Steamworks.ERRORS.InitalizeFail)
            }
            this.Greenworks = gw
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
    public AuthorizationToken: string = ''
    public InitalizeToken(gw: typeof greenworks): void
    {
        if (this.hasInitalized) return;
        console.log(`[SteamworksIntergration->InitalizeToken] Fetching Token`)
        var response = this.Greenworks.getEncryptedAppTicket('', (ticket) => {
            console.log(`[SteamworksIntergration->InitalizeToken] We've got the token!!`)
            this.AuthorizationToken = ticket.toString('hex');
            ipcRenderer.send('telemetry:setToken', this.AuthorizationToken)
        }, (err) => {
            console.error(`[SteamworksIntergration->InitalizeToken] Failed!!\n`, err)
            if (err.includes('Error on getting encrypted app ticket.')) {
                console.log(`[SteamworksIntergration->InitalizeToken] Retrying in 60s`)
                setTimeout(() => this.InitalizeToken(gw), 60000)
            }
        })
        console.debug(`[SteamworksIntergration->InitalizeToken] response:`, response)
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