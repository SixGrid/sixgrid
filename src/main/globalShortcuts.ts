import * as path from 'path'
import * as fs from 'fs'
import * as helpers from './helpers'
import { globalShortcut, app, ipcMain } from 'electron'

import { GlobalShortcutData } from '../shared/config'

interface GlobalShortcutActions
{
    relaunch(): void
    debugOutline(): void
    safeReload(): void
}
var globalShortcutActions: GlobalShortcutActions = {
    relaunch: () => {
        helpers.relaunchConfirm()
    },
    debugOutline: () => {
        if (global.electronMainWindow == undefined) return
        global.electronMainWindow.webContents.send('debug:elementOutline')
    },
    safeReload: () => {
        helpers.safeReload()
    }
}
global.globalShortcut_data = {
    relaunch: 'F10',
    debugOutline: 'F9',
    safeReload: 'F8'
}

function registerShortcuts(shortcuts: GlobalShortcutData) {
    console.debug(`[registerShortcuts] shortcuts; `, shortcuts)
    for (let pair of Object.entries(global.globalShortcut_data))
    {
        console.debug(`[registerShortcuts] unregisterPair`, pair)
        if (pair[1] == null)
            continue;
        globalShortcut.unregister(pair[1])
        console.debug(`[registerShortcuts] removed ${pair[1]}`)
    }
    console.debug(`[registerShortcuts] remove done`)
    for (let pair of Object.entries(shortcuts))
    {
        console.debug(`[registerShortcuts] registerPair`, pair)
        if (pair[1] == null)
        {
            console.debug(`[registerShortcuts] ${pair[0]} value is null, ignoring`)
            continue;
        }
        console.debug(`[registerShortcuts] set '${pair[0]}' to '${pair[1]}'`)
        let a = globalShortcutActions as any
        globalShortcut.register(pair[1], a[pair[0]])
    }
    global.globalShortcut_data = shortcuts
    console.debug(`[registerShortcuts] done`)
}
function updateGlobalShortcuts()
{
    let configLocation = path.join(helpers.steamCloudConfigDirectory(), 'config.json')
    let configFile = fs.readFileSync(configLocation).toString()
    let parsed = JSON.parse(configFile)

    var targetData = global.globalShortcut_data

    if (typeof parsed == 'object' &&
        parsed.mainProcShortcuts != undefined &&
        parsed.mainProcShortcuts != null &&
        typeof parsed.mainProcShortcuts == 'object')
    {
        targetData = parsed.mainProcShortcuts
    }

    let t = targetData as GlobalShortcutData
    try
    {
        registerShortcuts(t)
    }
    catch (e) {
        console.debug(e)
    }
    global.globalShortcut_data = targetData
    console.debug(`set globalShortcut_data`, global.globalShortcut_data)
}
function t(event: Electron.Event, input: Electron.Input) {
    console.debug('before-input-event', input.key.toLowerCase(), global.globalShortcut_data)
    for (let pair of Object.entries(global.globalShortcut_data))
    {
        if (pair[1] == input.key.toLowerCase())
        {
            event.preventDefault()
            let g = globalShortcutActions as any
            g[pair[0]]()
        }
    }
}
export function init()
{
    if (global.electronMainWindow != undefined)
    {
        global.electronMainWindow.webContents.on('before-input-event', (event, input) => {
            if (global.electronMainWindow == undefined) return
            t(event, input)
        })
    }
}
app.on('ready', () => {
    updateGlobalShortcuts()
})
ipcMain.on('reloadGlobalShortcuts', (event, data) => {
    updateGlobalShortcuts()
})