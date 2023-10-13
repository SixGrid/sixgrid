import * as Helper from './SGHelper'
import {remote} from 'electron'

export interface IFeatureFlags
{
    isSteam: boolean;
    isSteamDeck: boolean;
    isDevMode: boolean;
    enableDebugEndpointForMetrics: boolean;
}
export function Get(): IFeatureFlags
{
    return {
        isSteam: Helper.AllowSteamworks()
            || getenv('SIXGRID_STEAM') != null,
        isSteamDeck: Helper.IsSteamDeck()
            || getenv('SIXGRID_DECK') != null,
        isDevMode: Helper.IsDevMode()
            || getenv('SIXGRID_DEVMODE') != null,
        enableDebugEndpointForMetrics: Helper.IsDevMode()
            || remote.process.argv.includes('--devmode-endpoint-metrics')
            || getenv('SIXGRID_DEVMODE_ENDPOINT_METRICS') != null
    }
}

function getenv(key: string, fallback: string|null = null): string|null
{
    if (process.env[key] == undefined)
        return fallback
    let v = process.env[key]?.toString()
    return v == undefined ? fallback : v
}