# SixGrid

A Desktop Application for browsing e621 without buggy extensions or uncomfortable Web UI's. Take a peek at our [Trello Page](https://trello.com/b/2gfzCZg5/sixgrid) to see what's being done. If there are any problems with your experience feel free to put in an [Issue](https://github.com/sixgrid/sixgrid/issues) or to help solve the problem by submitting a [Pull Request](https://github.com/sixgrid/sixgrid/pulls).

~~[Download Latest Release](https://github.com/sixgrid/sixgrid/releases)~~ Releases are available via [Steam](https://store.steampowered.com/app/1992810/SixGrid/). Closed Beta changelogs can be found on [my discord server](https://sixgrid.kate.pet/discord), and a Beta Key can be requested by pinging `kate` in #sixgrid-support.

## Table of Contents

- [Features](#Features)
- [Building](#Building)
- [Contributing](#Contributing)
- [Creating Releases](#Creating_Releases)
- [Contributors](#Contributors)

## Features

- ~~Download Manager (Save to download later)~~ Soon!
- Post Browser

## Building

Clone the repository

```shell-script
$ git clone -b main https://github.com/sixgrid/sixgrid
```

(Contributing Only) Switch to Development Branch

```shell-script
$ git fetch
$ git pull
$ git checkout dev
```

Install Dependencies

```shell-script
$ npm install --include=dev
```

Run from the command line to see that everything works

```shell-script
$ npm start
```

Build Standalone (Default to `./out/SixGrid-[platform]-[arch]/`)

```shell-script
$ npm run package
```

Build Installer for Current Platform (Default to `./dist/`)

```shell-script
$ npm run build-installer
```

## Contributing

Switch over to the `dev` branch if you have not. By contributing we (The Contributers) assume that you have followed the steps in the [Building](#Building) section, this includes having installed node.js (LTS 16.x), npm, and the modules required to run SixGrid. We also assume that you know your way around the [e621 API](https://e621.net/help/api).

```shell-script
$ git fetch && git pull
$ git checkout dev
```

Once you have switched to the development branch you can now start programming, but before pushing any commits (or in some cases, even comitting) **_test your changes_**. No pull requests will be merged if your code does not meet our programming standards.

You can test your code by actually doing what it does and keeping an eye on the Chrome Inspector Console.

```shell-script
$ npm run
```

## Creating Releases

Change the `version` object in `package.json` to something unique (incremented), but **if this is a patch do not increment the version** in `package.json`

Commit new changes to the current branch, with the name of the version/release string, so for example if we're publishing version `0.3.1` pre-release `3` the version/release string is "0.3.1-3"

```shell-script
$ git commit -am 0.3.1-3
```

After the changes have been comitted, create a new tag with the same name of the version/release string but include "release-" before the version string, so if were publishing version `0.3.1` pre-release `3` the tag would be `release-0.2.5`.

```shell-script
$ git tag release-0.2.5
```

Once you have created your new tag push your changes.

```shell-script
$ git push
$ git push --tags
```

After you have pushed your **changes and tags** a release draft will be created. Just like manual releases, only users with the correct permissions can edit these.

## Contributors

- [Kate Ward](https://github.com/ktwrd) (Maintainer)
- [zyrn](https://github.com/zyme-xd)
