import { ipcRenderer } from 'electron'
import { ConfigKeys, IConfig_AuthProfile } from '../shared/config'

interface IGetResponse<T>
{
    result: GetResponseData<T>,
    success: boolean,
    errorMessage: String|null,
    givenReason: any
}
export type GetResponseData<T> = T|undefined|null
class GetResponse<T> implements IGetResponse<T>
{
    constructor(
        result: GetResponseData<T> = null,
        success: boolean = false,
        errorMessage: String|null = null,
        givenReason: any = null)
    {
        this.result = result
        this.success = success
        this.errorMessage = errorMessage
        this.givenReason = givenReason
    }

    result: GetResponseData<T> = null
    success: boolean = false
    errorMessage: String|null = null
    givenReason: any = null
}

interface ISetResponse
{
    result: any,
    success: boolean,
    errorMessage: String|null,
    givenReason: any
}
class SetResponse implements ISetResponse
{
    constructor(
        result: any = null,
        success: boolean = false,
        errorMessage: String|null = null,
        givenReason: any = null)
    {
        this.result = result
        this.success = success
        this.errorMessage = errorMessage
        this.givenReason = givenReason
    }
    result: any = null
    success: boolean = false
    errorMessage: String|null = null
    givenReason: any = null
}

interface IResponse<T>
{
    result: T|null,
    success: boolean,
    errorMessage: String|null,
    givenReason: any
}
function CreateResponse<T>(
    result: T|null = null,
    success: boolean = false,
    errorMessage: String|null = null,
    givenReason: any = null): IResponse<T>
{
    let data = {
        result,
        success,
        errorMessage,
        givenReason
    }
    return data
}

export class configBridgeClient
{
    getConfig<IConfig_AuthProfile>(key: 'Authentication', timeout: number): Promise<IGetResponse<IConfig_AuthProfile>>
    getConfig<IConfig_User>(key: 'User', timeout: number): Promise<IGetResponse<IConfig_User>>
    getConfig<IConfig_Stats>(key: 'Statistics', timeout: number): Promise<IGetResponse<IConfig_Stats>>
    getConfig<IConfig_Keybind>(key: 'Keybind', timeout: number): Promise<IGetResponse<IConfig_Keybind>>
    /**
     * @description
     * Fetch config data from Main Thread
     * @param key Key of the config to fetch
     * @param timeout Timeout, measured in milliseconds (default to 5s)
     * @returns @see IGetResponse
     */
    getConfig<T>(key: ConfigKeys, timeout: number = 5000): Promise<IGetResponse<T>>
    {
        return new Promise((resolve, reject) =>
        {
            var hasResolved = false
            ipcRenderer.invoke('config.get', key)
                .then((data) =>
                {
                    hasResolved = true

                    let response = new GetResponse(data, true)
                    resolve(response)
                })
                .catch((reason) =>
                {
                    hasResolved = true

                    let response = new GetResponse(null, false, "Caught on ipcRenderer.invoke('config.get')", reason)
                    reject(response)
                })

            setTimeout(() => {
                if (!hasResolved)
                {
                    let response = new GetResponse(null, false, `Timeout (${timeout}ms) on ipcRenderer.invoke('config.get', '${key}')`)
                    reject(response)
                }
            }, timeout)
        })
    }

    getValue(configKey: ConfigKeys, dataKey: any, timeout: number = 5000): Promise<IGetResponse<any>>
    {
        return new Promise((resolve, reject) =>
        {
            var hasResolved = false
            ipcRenderer.invoke('config.getValue', configKey, dataKey)
                .then((data) =>
                {
                    hasResolved = true

                    let response = new GetResponse(data, true)
                    resolve(response)
                })
                .catch((reason) =>
                {
                    hasResolved = true

                    let response = new GetResponse(null, false, "Caught on ipcRenderer.invoke('config.getValue')", reason)
                    reject(response)
                })

            setTimeout(() => {
                if (!hasResolved)
                {
                    let response = new GetResponse(null, false, `Timeout (${timeout}ms) on ipcRenderer.invoke('config.Value', '${configKey}', '${dataKey}')`)
                    reject(response)
                }
            }, timeout)
        })
    }

    /**
     * @description
     * Get available config keys
     * @param timeout Timeout, measured in milliseconds (default to 5s)
     * @returns List of config keys when `IResponse.success` is true
     */
    getKeys(timeout: number = 5000): Promise<IResponse<string[]>>
    {
        return new Promise((resolve, reject) =>
        {
            var hasResolved = false
            ipcRenderer.invoke('config.getKeys')
                .then((data) =>
                {
                    hasResolved = true

                    let response = CreateResponse<string[]>(data, true)
                    resolve(response)
                })
                .catch((reason) =>
                {
                    hasResolved = true

                    let response = CreateResponse<string[]>(null, false, "Caught on ipcRenderer.invoke('config.getKeys')", reason)
                    reject(response)
                })

            setTimeout(() => {
                if (!hasResolved)
                {
                    let response = new GetResponse(null, false, `Timeout (${timeout}ms) on ipcRenderer.invoke('config.getKeys')`)
                    reject(response)
                }
            }, timeout)
        })
    }


    set<IConfig_AuthProfile>(key: 'Authentication', data: IConfig_AuthProfile, timeout: number): Promise<ISetResponse>
    set<IConfig_User>(key: 'User', data: IConfig_User, timeout: number): Promise<ISetResponse>
    set<IConfig_Stats>(key: 'Statistics', data: IConfig_Stats, timeout: number): Promise<ISetResponse>
    set<IConfig_Keybind>(key: 'Keybind', data: IConfig_Keybind, timeout: number): Promise<ISetResponse>
    /**
     * @description
     * Set the data of a specific config.
     * @param key Config key to set
     * @param data Data of the config to set
     * @param timeout Timeout, measured in milliseconds (default to 5s)
     * @returns @see ISetResponse
     */
    set<T>(key: ConfigKeys, data: T, timeout: number = 5000): Promise<ISetResponse>
    {
        return new Promise((resolve, reject) =>
        {
            var hasResolved = false
            let postData = {
                key,
                data
            }
            ipcRenderer.invoke('config.set', postData)
                .then((data) =>
                {
                    hasResolved = true

                    let response = new SetResponse(data, true)
                    resolve(response)
                })
                .catch((reason) =>
                {
                    hasResolved = true

                    let response = new SetResponse(null, false, "Caught on ipcRenderer.invoke()", reason)
                    reject(response)
                })
            setTimeout(() => {
                if (!hasResolved)
                {
                    let response = new SetResponse(null, false, `Timeout (${timeout}ms) on ipcRenderer.invoke('config.set') with key of '${key}'`)
                    reject(response)
                }
            }, timeout)

        })
    }
}