import { EventEmitter } from 'events'
import { ipcRenderer } from "electron"

export class FavoriteManagerBridge extends EventEmitter
{
    public Favorites: string[] = []

    public constructor()
    {
        super()
        this.InitializeEvents()
    }

    private async InitializeEvents()
    {
        ipcRenderer.on('favoriteManager:read', (event, data: string[]) => {
            this.Favorites = data
        })
        ipcRenderer.on('favoriteManager:write', (event, data: string[]) => {
            this.Favorites = data
        })
    }

    public Contains(url: string): boolean
    {
        return this.Favorites.includes(url)
    }

    public SetState(url: string, state: boolean): Promise<boolean>
    {
        if (state)
            return this.Add(url)
        else
            return this.Remove(url)
    }

    public async Add(url: string): Promise<boolean>
    {
        return await ipcRenderer.invoke('favoriteManager:add', url)
    }
    public async Remove(url: string): Promise<boolean>
    {
        return await ipcRenderer.invoke('favoriteManager:remove', url)
    }
}