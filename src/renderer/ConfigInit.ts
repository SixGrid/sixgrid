import * as path from 'path'
import * as fs from 'fs'
import Configuration from './Configuration'
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
        data: {
            items: [
                {
                    auth: {
                        login: '',
                        apikey: '',
                        enabled: false
                    },
                    endpoint: 'https://e926.net'
                },
                {
                    auth: {
                        login: '',
                        apikey: '',
                        enabled: false
                    },
                    endpoint: 'https://e621.net'
                }
            ],
            _current: 0
        }
    },
    {
        filename: 'config.json',
        key: 'User',
        data: {
            media: {
                autoplay: true,
                loop: true
            },
            downloadFolder: path.join(require('electron').remote.app.getPath('downloads'), 'sixgrid'),
            saveMetadata: false,
            tagBlacklist: [],
            ratingFilter: 'none',
            preloadPageCount: 1,
            preloadStartIndex: 0,
            highQualityPreview: false,
            sortByScore: false,
            sortByFavorite: false,
            ratingSafe: false,
            ratingQuestionable: false,
            ratingExplicit: false
        }
    },
    {
        filename: 'stats.json',
        key: 'Statistics',
        data: {
            downloads: 0
        }
    }
]

export function Initialize()
{
    for (let item of configStoreProfiles)
    {
        let location = path.join(AppData.SteamCloudLocations.Config, item.filename)

        if (!fs.existsSync(location))
            fs.writeFileSync(location, JSON.stringify(item.data, null, '    '))

        if (global.AppData.CloudConfig[item.key] == undefined)
            global.AppData.CloudConfig[item.key] = new Configuration(location)
        global.AppData.CloudConfig[item.key].default(item.data)
        global.AppData.CloudConfig[item.key].write()
    }
}