#!/bin/bash
echo "======================== NOTICE ========================"
echo "This build script is meant for kate's build tools. So"
echo "be warned, some things may break when not using that ;w;"

git restore .
git pull

rm -rf node_modules/
# rm -rf lib/node_modules/

npm i
# npm i --prefix lib

node ./build-scripts/prebuild.js

rm -rf build/linux-unpacked
rm -rf build/win-unpacked
rm -rf build/artifacts/*.zip
rm -rf build/artifacts/*.gz

npm run build:wintux

cd steampipe
./publish.sh
./publish.beta.sh
cd ..

node build-scripts/get-artifacts.js
cp build/artifacts/* $build_outfolder
cp LICENSE.txt $build_outfolder
