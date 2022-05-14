const path = require('path')
const fs = require('fs')
const packageJSON = require('../package.json')
const tar = require('tar')
const archiver = require('archiver')

const kernelversion = require('os').release()

let BuildLocation = path.join(process.cwd(), 'build')

let regexEscapeReplace = (str) => {
    return str.replaceAll('.', '\\.')
}

let zipDirectory = (fullPath, self) => {
    let outputFilename = path.join(path.dirname(fullPath), self.upload_name)
    let outputFilestream = fs.createWriteStream(outputFilename)
    let archive = archiver('zip')
    return new Promise((resolve) => {
        outputFilestream.on('close', () => {
            resolve(outputFilename)
        })
        archive.pipe(outputFilestream)
        archive.directory(fullPath, false)
        archive.finalize()
    })
}
let tarballDirectory = async (fullPath, self) => {
    let tarballLocation = path.join(path.dirname(fullPath), self.upload_name)
    await tar.create({
        file: tarballLocation,
        cwd: fullPath,
        gzip: true
    }, fs.readdirSync(fullPath))
    return tarballLocation
}

let RegexMatrix = [
    {
        filename_regex: new RegExp(`^${regexEscapeReplace(packageJSON.build.productName)} ${regexEscapeReplace(packageJSON.version)}\.AppImage$`),
        upload_name: `${packageJSON.name}-${packageJSON.version}-linux-amd64.AppImage`,
        platform: 'linux'
    },
    {
        filename_regex: new RegExp(`^linux\-unpacked$`),
        upload_name: `${packageJSON.name}-${packageJSON.version}-linux-amd64.tar.gz`,
        onMatch: tarballDirectory,
        platform: 'linux'
    },
    {
        filename_regex: new RegExp(`^win\-unpacked$`),
        upload_name: `${packageJSON.name}-${packageJSON.version}-win-amd64.zip`,
        onMatch: zipDirectory
    },
    {
        filename_regex: new RegExp(`^${regexEscapeReplace(packageJSON.build.productName)} Setup ${regexEscapeReplace(packageJSON.version)}\.exe$`),
        upload_name: `${packageJSON.name}-${packageJSON.version}-win-amd64-setup.exe`
    }
]

let buildDirectoryFiles = fs.readdirSync(BuildLocation)

let _proc = async () => {
    for (let x = 0; x < buildDirectoryFiles.length; x++) {
        let fullPath = await path.join(BuildLocation, buildDirectoryFiles[x])
        let filename = buildDirectoryFiles[x]
        for (let y = 0; y < RegexMatrix.length; y++) {
            if (path.basename(filename).match(RegexMatrix[y].filename_regex) != null) {
                let artifactPath = path.join(BuildLocation, RegexMatrix[y].upload_name)
                if (RegexMatrix[y].onMatch != undefined && typeof RegexMatrix[y].onMatch == 'function') {
                    artifactPath = await RegexMatrix[y].onMatch(fullPath, RegexMatrix[y])
                }

                if (!fs.existsSync(artifactPath)) {
                    await fs.renameSync(fullPath, artifactPath)
                }

                if (!fs.existsSync(path.join(BuildLocation, 'artifacts'))) fs.mkdirSync(path.join(BuildLocation, 'artifacts'))

                let artifactPathOld = artifactPath.toString()
                artifactPath = path.join(BuildLocation, 'artifacts', path.basename(artifactPath))

                // Move to artifacts directory
                await fs.renameSync(
                    artifactPathOld,
                    path.join(BuildLocation, 'artifacts', path.basename(artifactPathOld)))

                console.log(path.basename(artifactPath))
            }
        }
    }
}
_proc()
