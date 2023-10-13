import axios from 'axios'
import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'
import { machineId } from 'node-machine-id';

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
    public get Endpoint(): string
    {
        if (process.env.NODE_END === 'development' || process.argv.includes('--devmode-endpoint-metrics'))
        {
            return 'http://localhost:5010/api/analytics';
        }
        return 'https://metric-server.sixgrid.kate.pet/api/analytics';
    }

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
            this.submitData(data.data)
        })

        ipcMain.on('telemetry:setToken', (event, token: string) =>
        {
            this.Token = token
        })
    }

    public MachineId: string = ''

    public async submitData(data: ITelemetryData<any>): Promise<void>
    {
        if (this.Token.length < 1)
            return;
        if (this.MachineId.length < 1)
        {
            this.MachineId = await machineId();
        }
        await axios.post(this.Endpoint, {
            token: this.Token,
            data
        })
    }
}
