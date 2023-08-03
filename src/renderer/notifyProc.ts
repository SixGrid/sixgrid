import axios, { AxiosError } from 'axios'
const { ipcRenderer } = require('electron')
import * as ElectronLog from 'electron-log'
export function notifyProc(data: any) {
    let log: ElectronLog.LogFunctions = global.AppData.Log.scope('notifyProc')
    if (AppData.CloudConfig.User.get('developerMetrics') && AppData.AllowSteamworks) {
        ipcRenderer.send('telemetry:setToken', AppData.Steamworks.AuthorizationToken)
        let pushData = {
            token: AppData.Steamworks.AuthorizationToken,
            data
        }
        axios.post('http://localhost:5010/api/analytics', pushData).then((d) => {
            log.debug('data: ', d.data)
        }).catch((e) => {
            if (e instanceof AxiosError == false)
                return;
            let error = e as AxiosError;
            let content = `${error.code}`;
            if (error.response != undefined || error.response != null)
            {
                log.error(`${error.response.status}`, error.response.data)
                content += ` ${error.response.status}`
                switch (error.response.status)
                {
                    case 403:
                    case 415:
                        if (error.response.data != undefined)
                            content += ` ${(error.response.data as any).Message}`
                        break;
                    default:
                        if (error.response.data != undefined)
                            content += ` ${typeof error.response.data == 'object' ? JSON.stringify(error.response.data) : error.response.data}`
                        break;
                }
            }
            (global.vueJS as any).$toastr.error(content, 'Telemetry Failed')
            log.error('Failed to send analytics', e)
        })
        // ipcRenderer.send('telemetry:postAction', pushData)
    }
}