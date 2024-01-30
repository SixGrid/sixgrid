const fs = require('fs')
let createHashContent = fs.readFileSync('./node_modules/webpack/lib/util/createHash.js').toString()
let injectContent = `const crypto = require("crypto");const originalCreateHash = crypto.createHash;crypto.createHash = (...args) => {if (args[0] == 'md4') {return originalCreateHash('md5');}return originalCreateHash(...args);};`
if (!createHashContent.includes(injectContent)) {
    createHashContent = `${injectContent}${require('os').EOL}${createHashContent}`
    fs.writeFileSync('./node_modules/webpack/lib/util/createHash.js', createHashContent)
}

var electronStoreFile = './node_modules/electron-store/index.js';
var electronStoreReplace = `(electron.app || electron.remote.app).getPath('userData');`
var electronStoreReplaceTarget = `(electron.app || require('@electron/remote').app).getPath('userData');`
if (fs.readFileSync(electronStoreFile).toString().includes(electronStoreReplace)) {
    fs.writeFileSync(electronStoreFile, fs.readFileSync(electronStoreFile).toString().replaceAll(electronStoreReplace, electronStoreReplaceTarget))
}