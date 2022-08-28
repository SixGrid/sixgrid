import { BrowserWindow } from 'electron'
export default class TelemetryManager {
    public static readonly EndpointURL: string = 'https://sixgrid.dxcdn.net';
    public Window: BrowserWindow = null
    public constructor(mainWindow: BrowserWindow)
    {
        this.Window = mainWindow
        console.log(`[TelemetryManager->constructor] Instance Created`)
    }
}
