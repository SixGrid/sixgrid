#!/bin/bash
echo "======================== NOTICE ========================"
echo "This build script is meant for kate's build tools. So"
echo "be warned, some things may break when not using that ;w;"

git restore .
git pull

rm -rf node_modules/
# rm -rf lib/node_modules/

npm i
npm install --legacy-peer-deps
# npm i --prefix lib

node ./build-scripts/prebuild.js

rm -rf build/linux-unpacked
rm -rf build/win-unpacked
rm -rf build/artifacts/*.zip
rm -rf build/artifacts/*.gz

sudo apt install flatpak flatpak-builder -y
sudo flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo
sudo flatpak install flathub org.freedesktop.Sdk/x86_64/23.08 org.freedesktop.Platform/x86_64/23.08 app/org.electronjs.Electron2.BaseApp/x86_64/23.08 -y

npm run build:wintux

cd steampipe
./publish.sh
./publish.beta.sh
cd ..

node build-scripts/get-artifacts.js
cp build/artifacts/* $build_outfolder
cp LICENSE.txt $build_outfolder
