
const fs = require('fs')
const dayjs = require('dayjs')
const packageJson = require('../package.json')
const releaseInfo = require('./releaseInfo')
const webpack = require('webpack')

module.exports = {
    get globalInjectData() {
        const buildTimestamp = (new Date(process.env['CI_COMMIT_TIMESTAMP'] ?? '')).getTime() || Date.now()
        let data = {
            __SIXGRIDBUILDTIMESTAMP__: buildTimestamp,
            __SIXGRID_PRODUCT_BUILD_TIMESTAMP: dayjs(buildTimestamp).format('YYYY/MM/DD hh:mm:ss A'),
            __SIXGRID_PRODUCT_BUILD_VERSION: packageJson.version,
        }
        data.__PRODUCT_EXTENDED_INFORMATION = releaseInfo(data)
        return data
    },
    get extendedReleaseInfo() {
        let data = this.globalInjectData
        return releaseInfo(this.globalInjectData)
    },
    webpackPlugin() {
        let buildInfo = this.globalInjectData
        let mappedEntries = Object.entries(buildInfo)
            .map(data => [data[0], JSON.stringify(data[1])])
        return new webpack.DefinePlugin(Object.fromEntries(mappedEntries))
    }
}