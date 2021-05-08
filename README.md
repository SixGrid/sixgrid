# SixGrid
A Desktop Application for browsing e621 without buggy extensions or uncomfortable Web UI's. Take a peek at our [Trello Page](https://trello.com/b/2gfzCZg5/sixgrid) to see what's being done. If there are any problems with your experience feel free to put in an [Issue](https://github.com/jylescoad-ward/esix-gui/issues) or to help solve the problem by submitting a [Pull Request](https://github.com/jylescoad-ward/esix-gui/pulls).

## Table of Contents
- [Features](#Features)
- [Building](#Building)
- [Contributors](#Contributors)

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