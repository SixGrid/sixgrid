import * as path from 'path'
import * as fs from 'fs'
import Configuration from './Configuration'
import { DefaultData } from '../shared/configDefault'
export interface IConfigTemplate<T>
{
    filename: string
    key: string
    data: any
}
export const configStoreProfiles: IConfigTemplate<any>[] = [
    {
        filename: 'authProfile.json',
        key: 'Authentication',
        data: DefaultData.Authentication
    },
    {
        filename: 'config.json',
        key: 'User',
        data: DefaultData.User
    },
    {
        filename: 'stats.json',
        key: 'Statistics',
        data: DefaultData.Statistics
    },
    {
        filename: 'keybind.json',
        key: 'Keybind',
        data: DefaultData.Keybind
    }
]

export function Initialize()
{
    for (let item of configStoreProfiles)
    {
        let location = path.join(AppData.SteamCloudLocations.Config, item.filename)

        if (!fs.existsSync(AppData.SteamCloudLocations.Config)) {
            fs.mkdirSync(AppData.SteamCloudLocations.Config, { recursive: true })
        }

        if (!fs.existsSync(location))
            fs.writeFileSync(location, JSON.stringify(item.data, null, '    '))

        if (global.AppData.CloudConfig[item.key] == undefined)
            global.AppData.CloudConfig[item.key] = new Configuration(location)
        global.AppData.CloudConfig[item.key].default(item.data)
        global.AppData.CloudConfig[item.key].write()
    }

    if (global.AppData.CloudConfig.User.get('downloadFolder').length < 1)
    {
        global.AppData.CloudConfig.User.set('downloadFolder', path.join(require('electron').remote.app.getPath('home'), 'Downloads', 'sixgrid'))
        global.AppData.CloudConfig.User.write()
    }

}
export function ResetItem(name: string)
{
    for (let item of configStoreProfiles)
    {
        if (item.key == name)
        {
            AppData.CloudConfig[item.key]._data = item.data
            AppData.CloudConfig[item.key].write()
        }
    }
}