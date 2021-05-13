# SixGrid
A Desktop Application for browsing e621 without buggy extensions or uncomfortable Web UI's. Take a peek at our [Trello Page](https://trello.com/b/2gfzCZg5/sixgrid) to see what's being done. If there are any problems with your experience feel free to put in an [Issue](https://github.com/jylescoad-ward/esix-gui/issues) or to help solve the problem by submitting a [Pull Request](https://github.com/jylescoad-ward/esix-gui/pulls).

[Download Latest Release](https://github.com/jylescoad-ward/esix-gui/releases)

## Table of Contents
- [Features](#Features)
- [Building](#Building)
- [Contributors](#Contributors)
- [Creating Releases](#Creating_Releases)

## Features
- Download Manager (Save to download later)
- Post Browser

## Building
Clone the repository
```sh
$ git clone https://github.com/jylescoad-ward/esix-gui

$ cd esix-gui
```

Install Dependencies
```sh
$ npm install
```

Run from the command line to see that everything works
```sh
$ npm start
```


Build Standalone (Default to `./out/SixGrid-[platform]-[arch]/`)
```sh
$ npm run package
```

Build Installer for Current Platform (Default to `./dist/`)
```sh
$ npm run build-installer
```

## Contributors
- [Jyles Coad-Ward](https://github.com/jylescoad-ward) (Maintainer)
- [zyrn](https://github.com/zyme-xd)

## Creating Releases
Change the `version` object in `package.json` to something unique (incremented), but **if this is a patch do not increment the version** in `package.json`


Commit new changes to the current branch, with the name of the version/release string, so for example if we're publishing version `0.2.5` patch `3` the version/release string is "0.2.5-p3"
```sh
$ git commit -am 0.2.5-p3
```


After the changes have been comitted, create a new tag with the same name of the version/release string but include "release-" before the version string, so if were publishing version `0.2.5` patch `3` the tag would be `release-0.2.5-p3`.
```sh
$ git tag release-0.2.5-p3
```


Once you have created your new tag push your changes.
```sh
$ git push
$ git push --tags
```

After you have pushed your **changes and tags** a release draft will be created. Just like manual releases, only users with the correct permissions can edit these.

