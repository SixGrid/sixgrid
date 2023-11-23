import { BrowserWindow, ipcMain } from 'electron'
import * as helpers from '../helpers'
import * as sharedHelper from '../../shared/sharedHelper'
import { ConfigFileMap, ConfigKeys, ConfigTypeMap, PostDataSetConfig } from '../../shared/config'
import { DefaultData as DefaultConfigData } from '../../shared/configDefault'
import path from 'path'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'

export class ConfigManager {
    static get instance() {
        if (global.configManager == undefined)
        {
            global.configManager = new ConfigManager()
        }
        return global.configManager
    }

    static get baseDirectory() {
        return helpers.steamCloudConfigDirectory()
    }

    /**
     * @description
     * Config Manager.
     * 
     * Note: This class is a singleton and only one instance can be created.
     * @throws
     * Will throw the error `global.electronMainWindow is undefined!!!` when `global.electronMainWindow` hasn't been created yet.
     * 
     * It will also throw an error when `global.configManager` is defined already. This is because ConfigManager is a singleton and only one instance can be created.
     */
    constructor() {
        if (global.electronMainWindow == undefined)
            throw new Error('global.electronMainWindow is undefined!!!')
        if (global.configManager != undefined)
            throw new Error('Instance of global.configManager exists already!')
        
        global.configManager = this
        
        this.window = global.electronMainWindow
        this.cache = sharedHelper.deepClone({}, DefaultConfigData) as ConfigTypeMap

        this.loadData()

        this.initIPC()
        
        this.saveLoop = setInterval(() => {
            this.saveAll(true)
        }, 5000)
    }

    saveLoop: NodeJS.Timer
    window: BrowserWindow
    cache: ConfigTypeMap
    /**
     * @description
     * Stores when a config was last modified via `ConfigManager.set()`
     */
    lastModify: {[key in ConfigKeys]: number} = {
        'Authentication': 0,
        'User': 0,
        'Statistics': 0,
        'Keybind': 0
    }
    /**
     * @description
     * Stores when a config was last saved via `ConfigManager.save()`
     */
    lastSave: {[key in ConfigKeys]: number} = {
        'Authentication': 0,
        'User': 0,
        'Statistics': 0,
        'Keybind': 0
    }
    pendingSave: {[key in ConfigKeys]: boolean} = {
        'Authentication': false,
        'User': false,
        'Statistics': false,
        'Keybind': false
    }

    private loadData()
    {
        if (!existsSync(ConfigManager.baseDirectory))
            mkdirSync(ConfigManager.baseDirectory)
        let entries = Object.entries(ConfigFileMap) as [ConfigKeys, string][]
        for (let pair of entries)
        {
            let location = path.join(ConfigManager.baseDirectory, pair[1])
            if (!existsSync(location))
            {
                writeFileSync(location, JSON.stringify(this.cache[pair[0]], null, '    '))
            }

            let data = readFileSync(location).toString()
            let parsed = JSON.parse(data)
            this.cache[pair[0]] = parsed
        }
    }

    private initIPC()
    {
        ipcMain.handle('config.get', (event, key: String) =>
        {
            if (this.cache[key as ConfigKeys] == undefined)
                throw new Error(`Key provided '${key}' does not exist`)
            return this.cache[key as ConfigKeys]
        })
        ipcMain.handle('config.getKeys', (event) =>
        {
            return Object.entries(this.cache).map(v => v[0])
        })
        ipcMain.handle('config.set', (event, data: PostDataSetConfig) =>
        {
            this.set(data.key, data.data)
        })

        ipcMain.handle('config.saveAll', (event) => {
            this.saveAll()
        })
        ipcMain.handle('config.save', (event, key: ConfigKeys) => {
            this.save(key)
        })
    }
    /**
     * @description
     * Save all cached configs.
     * @param onlyPending Only save item if `pendingSave[key]` is true
     */
    saveAll(onlyPending: boolean = false) {
        for (let pair of Object.entries(this.cache)) {
            if (onlyPending) {
                if (!this.pendingSave[pair[0] as ConfigKeys])
                    continue;
            }
            this.save(pair[0] as ConfigKeys)
        }
    }

    save(key: ConfigKeys) {
        if (!existsSync(ConfigManager.baseDirectory))
            mkdirSync(ConfigManager.baseDirectory)

        let targetPath = path.join(
            ConfigManager.baseDirectory,
            ConfigFileMap[key])
        
        let data = JSON.stringify(this.cache[key], null, '    ')
        writeFileSync(targetPath, data)

        this.pendingSave[key] = false
        this.lastSave[key] = Date.now()
    }

    set(key: ConfigKeys, value: any): void
    {
        this.cache[key] = value
        this.lastModify[key] = Date.now()
        this.pendingSave[key] = true
    }
    get(key: ConfigKeys): void
    {
        if (this.cache[key] == undefined)
            throw new Error(`Key '${key}' does not exist in cache`)
        return sharedHelper.clone(this.cache[key])
    }

    update(key: ConfigKeys): void
    {
        let data: any = this.get(key)
        data = {
            ...DefaultConfigData[key],
            ...data
        }
        this.set(key, data)
    }
}