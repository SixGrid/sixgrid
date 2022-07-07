const fs = require('fs')
let createHashContent = fs.readFileSync('./node_modules/webpack/lib/util/createHash.js').toString()
let injectContent = `const crypto = require("crypto");const originalCreateHash = crypto.createHash;crypto.createHash = (...args) => {if (args[0] == 'md4') {return originalCreateHash('md5');}return originalCreateHash(...args);};`
if (!createHashContent.includes(injectContent)) {
    createHashContent = `${injectContent}${require('os').EOL}${createHashContent}`
    fs.writeFileSync('./node_modules/webpack/lib/util/createHash.js', createHashContent)
}