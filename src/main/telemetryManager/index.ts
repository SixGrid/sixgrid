import axios from 'axios'
import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'

export interface InterProtoData
{
    token: string
    data: ITelemetryData<any>
}
export interface ITelemetryData<T>
{
    eventName: string
    data: T
}

export default class TelemetryManager extends EventEmitter {
    public Window: BrowserWindow
    public constructor(mainWindow: BrowserWindow)
    {
        super()
        this.Window = mainWindow
        console.debug(`[TelemetryManager->constructor] Instance Created`)
        this.initializeWindowEvents()
        this.initializeEvents()
    }

    public HeartbeatInterval: any
    public Token: string = ''
    public Endpoint: string = 'http://localhost:5010/api/analytics'

    private initializeEvents(): void
    {
        this.initializeWindowEvents()

        this.HeartbeatInterval = setInterval(() => {
            this.submitData({
                eventName: 'heartbeat',
                data: Date.now()
            })
        }, 5000)
    }
    public close(): void
    {
        if (this.HeartbeatInterval != null)
        {
            clearInterval(this.HeartbeatInterval)
        }
    }

    private initializeWindowEvents(): void
    {
        ipcMain.on('telemetry:hello', (event) => {
            event.returnValue = null
        })
        ipcMain.on('telemetry:postAction', (event, data: InterProtoData) => {
            if (data == undefined) return null
            console.log(data)
        })

        ipcMain.on('telemetry:setToken', (event, token: string) =>
        {
            this.Token = token
        })
    }

    public async submitData(data: ITelemetryData<any>): Promise<void>
    {
        if (this.Token.length < 1)
            return;
        await axios.post(this.Endpoint, {
            token: this.Token,
            data
        })
    }
}
