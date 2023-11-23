import { EventEmitter } from "events"
import { MetricManagerData } from "../shared/metricManager"
import * as ElectronLog from 'electron-log'
let log: ElectronLog.LogFunctions;
export default class MetricManager extends EventEmitter
{
    public constructor()
    {
        super()
        log = global.AppData.Log.scope('metricManager')
    }
    /**
     * @returns {boolean} Successfully increment item
     */
    Increment(key: string) : boolean
    {
        if (this.MetricStore[key] == undefined)
            return false;
        let currentData = this.MetricStore[key]
        if (currentData.max != -1)
        {
            if (currentData.value + 1 > currentData.max)
            {
                log.warn(`Did not increment ${key} since the next value is greater than the maximum value`)
                return false;
            }
        }

        try
        {
            this.MetricStore[key].value += 1
        }
        catch (ex)
        {
            log.error(`Failed to increment ${key}`, ex)
            return false;
        }
        log.log(`[MetricManager] Incremented ${key} (${currentData} -> ${this.MetricStore[key].value})`)
        this.emit('update', this.MetricStore[key])
        this.Write()
        return true;
    }

    Exists(key: string): boolean
    {
        return this.MetricStore[key] == undefined
    }
    Set(key: string, value: number): boolean
    {
        if (this.MetricStore[key] == undefined)
            return false;

        let currentValue: number = this.MetricStore[key].value
        if (this.MetricStore[key].type == 'int' &&  AppData.isFloat(currentValue))
        {
            throw new Error(`Key type is integer but given value is float`)
        }

        if (this.MetricStore[key].incrementOnly)
        {
            let assumedNewValue = this.MetricStore[key].value + 1
            if (assumedNewValue != value)
                throw new Error(`Given value (${value}) does not equal the expected value (${assumedNewValue})`)
        }

        // Dont bother updating since it's at the maximum already
        if (value > this.MetricStore[key].max && this.MetricStore[key].max != -1)
        {
            throw new Error(`Given value is greater than the maximum value`)
        }
        // Same goes for if the minimum value is greater than the new value
        if (value < this.MetricStore[key].min)
        {
            throw new Error(`Given value is less than the minimum value`)
        }

        try
        {
            this.MetricStore[key].value = value
        }
        catch (ex)
        {
            log.error(`Failed to increment ${key}`, ex)
            return false;
        }
        this.emit('update', this.MetricStore[key])
        this.Write()
        return true;
    }

    Get(key: string): number|null
    {
        if (this.MetricStore[key] == undefined)
            return null;

        return this.MetricStore[key].value;
    }
    GetAll(): MetricManagerData
    {
        return JSON.parse(JSON.stringify(this.MetricStore))
    }
    GetAllData(): {[key: string]: number}
    {
        let items = Object.entries(this.MetricStore)
        let returnData: {[key: string]: number} = {}
        for (let pair of items)
            returnData[pair[0]] = pair[1].value
        return returnData
    }
    SetData(data: MetricManagerData)
    {
        this.MetricStore = data
    }
    private MetricStore: MetricManagerData = {
        download_completeCount: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_downloadpost',
            increment: true,
            type: 'int'
        },
        uncaughtException: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_uncaughtException',
            increment: true,
            type: 'int'
        },
        favorite_count: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postFavorite',
            increment: true,
            type: 'int'
        },
        search_count: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_query',
            increment: true,
            type: 'int'
        },
        post_downvote_count: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postdownvote',
            increment: true,
            type: 'int'
        },
        post_upvote_count: {
            min: 0,
            max: -1,
            default: 0,
            value: 0,
            incrementOnly: true,
            name: 'stat_count_postupvote',
            increment: true,
            type: 'int'
        }
    }

    Write(): void
    {
        global.AppData.CloudConfig.Statistics.set('metricStore', this.MetricStore)
        global.AppData.CloudConfig.Statistics.write()
    }
    Read(): void
    {
        var configData = global.AppData.CloudConfig.Statistics.get('metricStore')
        if (Object.entries(configData).length < 1)
        {
            this.Write()
        }
        this.MetricStore = configData
    }
    Reset(): void
    {
        var entries = Object.entries(this.MetricStore)
        for (let pair of entries)
        {
            if (pair[1].incrementOnly)
                continue;
            this.Set(pair[0], pair[1].default)
        }
        this.Write()
    }
}