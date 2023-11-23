import { ipcRenderer } from 'electron'

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
    /**
     * @description
     * Fetch config data from Main Thread
     * @param key Key of the config to fetch
     * @param timeout Timeout, measured in milliseconds (default to 5s)
     * @returns @see IGetResponse
     */
    get<T>(key: String, timeout: number = 5000): Promise<IGetResponse<T>>
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

    /**
     * @description
     * Set the data of a specific config.
     * @param key Config key to set
     * @param data Data of the config to set
     * @param timeout Timeout, measured in milliseconds (default to 5s)
     * @returns @see ISetResponse
     */
    set<T>(key: String, data: T, timeout: number = 5000): Promise<ISetResponse>
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