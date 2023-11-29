import { ConfigTypeMap } from "./config"

export const DefaultData: ConfigTypeMap = {
    'Authentication': {
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
    },
    'User': {
        media: {
            autoplay: true,
            loop: true
        },
        downloadFolder: '',
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
        zoomFactor: 1.0,
        mainProcShortcuts: {
            relaunch: 'F10',
            debugOutline: 'F9',
            safeReload: 'F8'
        }
    },
    'Statistics': {
        metricStore: {}
    },
    'Keybind': {
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
        },
        profiles: {}
    }
}