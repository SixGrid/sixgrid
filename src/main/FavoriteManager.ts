import * as path from 'path'
import { BrowserWindow, ipcMain } from "electron"
import {EventEmitter} from 'events'
import { existsSync, fstat, readFileSync, writeFileSync } from 'fs'

export default class FavoriteManager extends EventEmitter
{
    public Window: BrowserWindow
    public static FavoriteLocation: string = path.resolve('./config/favorite.json')

    public constructor(window: BrowserWindow)
    {
        super()
        this.Window = window

        this.InitializeListeners()

        this.on('read', this.Read)
        this.on('write', this.Write)

        this.emit('read')
    }


    public Favorites: string[] = []

    private async InitializeListeners(): Promise<void>
    {
        ipcMain.handle('favoriteManager:state', (event, url) => {
            return this.Favorites.includes(url)
        })
        ipcMain.handle('favoriteManager:remove', (event, url) => {
            return this.Remove(url)
        })
        ipcMain.handle('favoriteManager:add', (event, url) => {
            return this.Add(url)
        })
    }

    public Remove(url: string): boolean
    {
        if (!this.Favorites.includes(url))
            return false
        this.Favorites = this.Favorites.filter(v => v != url)
        this.emit('write')
        return true
    }

    public Add(url: string): boolean
    {
        if (this.Favorites.includes(url))
            return false
        this.Favorites.push(url)
        this.emit('write')
        return true
    }

    public Write(): void
    {
        writeFileSync(FavoriteManager.FavoriteLocation, JSON.stringify(this.Favorites, null, ''))
        this.Window.webContents.postMessage('favoriteManager:write', this.Favorites)
    }
    public Read(): boolean
    {
        let exists = existsSync(FavoriteManager.FavoriteLocation)
        if (exists)
            this.Favorites = JSON.parse(readFileSync(FavoriteManager.FavoriteLocation).toString())
        else
            writeFileSync(FavoriteManager.FavoriteLocation, '[]')
        this.Window.webContents.postMessage('favoriteManager:read', this.Favorites)
        return exists
    }
}