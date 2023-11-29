import type * as greenworks from 'greenworks'
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
export type SteamMetricType = 'int'|'float'