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
            get downloadFolder() {
                return path.join(require('electron').remote.app.getPath('home'), 'Downloads', 'sixgrid')
            },
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
            ratingExplicit: false,
            zoomFactor: 1.0
        }
    },
    {
        filename: 'stats.json',
        key: 'Statistics',
        data: {
            metricStore: {}
        }
    },
    {
        filename: 'keybind.json',
        key: 'Keybind',
        data: {
            currentProfile: 'default',
            currentProfileData: {
                Id: 'gvvqMEmj',
                Name: 'Default',
                Binds: [
                    {
                        Id: 'METs7gPv',
                        Chords: [[39]],
                        Enable: true,
                        Channel: 'item:next'
                    },
                    {
                        Id: 'g0FPjBOz',
                        Chords: [[37]],
                        Enable: true,
                        Channel: 'item:previous'
                    },
                    {
                        Id: '6mRXSbBE',
                        Chords: [[27]],
                        Enable: true,
                        Channel: 'view:close'
                    }
                ]
            }
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