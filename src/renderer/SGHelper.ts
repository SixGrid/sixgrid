import {remote, shell} from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export interface SGHelperInterface
{
    RootURI(): string
    isFloat(): boolean
    isInteger(): boolean
    AllowSteamworks(): boolean
    IsSteamDeck(): boolean
    IsDevMode(): boolean
    AllowDevEndpointForMetrics(): boolean
    OpenExternal(url: string): void
    isObject(item: any): boolean
    DeepAssign(target: any, source: any): any
    GetUserDataPath() : string
}

export function RootURI()
{
    let target = `http://localhost:9080/`
    if (process.env.NODE_ENV != 'development')
    {
        let inner = 'file://'
        if (process.platform == 'win32')
        {
            inner += '/'
        }
        inner += __dirname.replaceAll('\\', '/')
        inner += '/index.html'
        target = inner
    }
    return target.split('?')[0]
}

export function isFloat(n: any): boolean
{
    return Number(n) === n && n % 1 !== 0;
}
export function isInteger(n: any): boolean
{
    return Number(n) === n && n % 1 === 0;
}

export function AllowSteamworks(): boolean
{
    return remote.process.argv.includes('--steam')
}
/**
 * @description
 * Checks if SixGrid is running on a steam deck. Must match the following cases;
 * - Launched with `--steam-deck`
 * - OS Release includes `valve` *and* AllowSteamworks() is `true`
 * @returns {boolean}
 */
export function IsSteamDeck(): boolean
{
    let osRelease = os.release()
    let releaseMatch = osRelease.includes('valve') && AllowSteamworks()
    return releaseMatch || remote.process.argv.includes('--steam-deck')
}

export function IsDevMode(): boolean
{
    return remote.process.argv.includes('--devmode')
    || process.env.NODE_ENV == 'development'
}

export function AllowDevEndpointForMetrics(): boolean
{
    return remote.process.argv.includes('--devmode-endpoint-metrics')
}

export function OpenExternal(url: string): void
{
    shell.openExternal(url)
}

export function isObject(item: any): boolean {
    return (item && typeof item === 'object' && !Array.isArray(item));
}
export function DeepAssign(target: any, source: any): any
{
    let output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target))
                    Object.assign(output, { [key]: source[key] });
                else
                    output[key] = DeepAssign(target[key], source[key]);
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    return output;
}

export function GetUserDataPath() : string
{
    let val = path.join(
        remote.app.getPath('userData'),
        global.AppData.ApplicationIdentifier)
    if (!fs.existsSync(val))
        fs.mkdirSync(val, {recursive: true})
    return val
}