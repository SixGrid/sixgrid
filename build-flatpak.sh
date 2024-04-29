#!/bin/bash

sudo apt install flatpak flatpak-builder -y
sudo flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
sudo flatpak install flathub org.freedesktop.Sdk/x86_64/23.08 org.freedesktop.Platform/x86_64/23.08 app/org.electronjs.Electron2.BaseApp/x86_64/23.08 -y

npm i
npm install --legacy-peer-deps
node build-scripts/prebuild.js

npm run build:flatpak-full