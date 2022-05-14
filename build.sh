#!/bin/bash
echo "======================== NOTICE ========================"
echo "This build script is meant for kate's build tools. So"
echo "be warned, some things will break ;w;"

git restore .
git pull

cd steampipe
./publish.sh
./publish.beta.sh
cd ..

node build-scripts/get-artifacts.js
cp build/artifacts/* $build_outfolder
cp LICENSE.txt $build_outfolder
