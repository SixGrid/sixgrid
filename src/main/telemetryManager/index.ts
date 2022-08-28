import { BrowserWindow, ipcMain } from 'electron'
import { EventEmitter } from 'events'

import {ITelemetryData} from './ITelemetryData'

export interface InterProtoData
{
    
}

export default class TelemetryManager extends EventEmitter {
    public static readonly EndpointURL: string = 'https://sixgrid.dxcdn.net';
    public Window: BrowserWindow = null
    public constructor(mainWindow: BrowserWindow)
    {
        super()
        this.Window = mainWindow
        console.debug(`[TelemetryManager->constructor] Instance Created`)
    }

    private initializeWindowEvents(): void
    {
        ipcMain.on('telemetry:hello', (event) => {
            event.returnValue = null
        })

        ipcMain.on('telemetry:postAction', (event, data: InterProtoData) => {
            if (data == undefined) return null

            
        })
    }

    public async submitData(data: ITelemetryData<any>): Promise<void>
    {
        
    }
}
