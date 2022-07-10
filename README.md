# SixGrid

A Desktop Application for browsing e926-based websites without the hassle of installing browser extensions or uncomfortable Web Interfaces, and you won't be embarrassed by your browsers autofill making thing awkward when someone is around!

Take a peek at our [Trello Page](https://sixgrid.kate.pet/trello) to see what the developers are currently working on. If there are any problems with your experience with the SixGrid App, feel free to create a [Issue](https://github.com/sixgrid/sixgrid/issues) and to suggest a change to the codebase, or documentation, then you can create a [Pull Request](https://github.com/sixgrid/sixgrid/pulls).

~~You can download the latest release [here](https://github.com/sixgrid/sixgrid/releases/latest)~~. Currently, Releases are only available on [Steam](https://store.steampowered.com/app/1992810) which is ~~free~~ restricted to an invite-only beta. To request access to the SixGrid Steam Beta, join [Kate's Discord Server](https://sixgrid.kate.pet/discord) and ping `kate` in the [`sixgrid-support` channel](https://discord.com/channels/832410110960730112/973104133886337044)

## Table of Contents

- [Features](#Features)
- [Developing](#Developing)
- [Contributing](#Contributing)
- [Contributors](#Contributors)

### Features
- Material Design UI
- Faster Post Loading Speeds than e926 on browsers
- Image/Video Caching
- Account Profiles
- Steam Cloud Saving
- Anonymous Mode (soon!)
- Pool Downloading (soon!)

### Developing

Requirements
- NodeJS LTS (16.x)
- A Window Manager (Support on Wayland may be limited)

Setup the development environment
```bash
mkdir sixgrid
cd sixgrid

#-- Only for library development
git clone https://github.com/sixgrid/libsixgrid
cd libsixgrid
npm install
npm link # root priviliages may be required

#-- Run this in a seperate terminal
npm run watch

cd ..

#-- Required
git clone https://github.com/sixgrid/sixgrid
cd sixgrid
npm install
npm link libsixgrid # Only do this if you linked libsixgrid previously
npm run dev
```
#### Building
A portable version for your platform will be in `build/` and should end with `-unpacked` after running the following command;
```bash
# Current Platform
npm run build

# Windows and Linux
npm run build:wintux
```

### Contributing
Switch over to the `dev` branch if you have not. By contributing we (The Contributors) assume that you have followed the steps in the [Building](#Building) and [Developing](#Developing) section, this includes having installed node.js (LTS 16.x), npm, and the modules required to run SixGrid. We also assume that you know your way around the [e926 API](https://e926.net/help/api).

```bash
git fetch
git pull
git checkout dev
```

Once you have switched to the development branch you can now start programming, but before pushing any commits (or in some cases, even committing) **_test your changes_**. No pull requests will be merged if your code does not meet our programming standards.

You can test your code by actually doing what it does and keeping an eye on the Chrome Inspector Console.

```bash
npm run dev
```

## Contributors

- [Kate Ward](https://github.com/ktwrd) (Maintainer)
- [zyrn](https://github.com/zyme-xd)