import './global.ts'
import * as fs from 'fs'
import * as util from 'util'
import * as process from 'process'
import * as path from 'path'

export enum EConsoleType
{
    Log,
    Debug,
    Warning,
    Error
}

const stdout = process.stdout
const stderr = process.stderr

let startDate = Date.now()
export const FileLocation: string = path.join(process.cwd(), `sixgrid.${startDate}.log`)
global.logfile_FileStream = fs.createWriteStream(FileLocation, {flags: 'w'})
export function FetchPrefix(consoleType: EConsoleType): string
{
    let content: string = `[LOG]  `
    switch (consoleType)
    {
        case EConsoleType.Debug:
            content += `[DEBUG]`
            break
        case EConsoleType.Warning:
            content += `[WARN] `
            break
        case EConsoleType.Error:
            content += `[ERROR]`
            break
    }
    return content
}
export function WriteStandardOutput(consoleType: EConsoleType, ...data: any): void
{
    let content: string = FetchPrefix(consoleType)
    content += ` [${new Date(Date.now())}] `
    for (let item of data)
        content += util.format.apply(null, item) + ',\n'
    content += '\n'
    global.logfile_FileStream.write(content)
    if (consoleType == EConsoleType.Error)
        stderr.write(content)
    else
        stdout.write(content)
}

export function Hook(): void
{
    if (global.OldConsole != undefined || global.OldConsole.log != undefined) return

    global.OldConsole = {
        log: null,
        debug: null,
        warn: null,
        error: null
    }

    console.log(global.OldConsole)
    global.OldConsole.log = console.log
    global.OldConsole.debug = global.console.debug
    global.OldConsole.warn = global.console.warn
    global.OldConsole.error = global.console.error

    console.log = (...d) => {WriteStandardOutput(EConsoleType.Log, ...d)}
    console.debug = (...d) => {WriteStandardOutput(EConsoleType.Debug, ...d)}
    console.warn = (...d) => {WriteStandardOutput(EConsoleType.Warning, ...d)}
    console.error = (...d) => {WriteStandardOutput(EConsoleType.Error, ...d)}
}