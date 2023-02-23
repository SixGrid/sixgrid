const packageJSON = require('../package.json')

module.exports = (buildInfo) => {
    return {
        version: packageJSON.version,
        name: packageJSON.name,
        timestamp: parseInt(buildInfo.__SIXGRIDBUILDTIMESTAMP__),
        envtimestamp: parseInt(process.env['timestamp'] || (new Date(process.env['CI_COMMIT_TIMESTAMP'] ?? '')).getTime() || '0'),
        productName: packageJSON.build.productName,
        appID: packageJSON.build.appId,
        commitHash: process.env['CI_COMMIT_SHA'] || require('child_process').execSync(`git rev-parse HEAD`).toString().split('\n')[0],
        commitHashShort: process.env['CI_COMMIT_SHORT_SHA'] || require('child_process').execSync(`git rev-parse --short HEAD`).toString().split('\n')[0]
    }
}