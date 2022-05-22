#!/bin/bash
cd ..
npm i
npm i --prefix lib
npm run build:wintux
cd steampipe
source secret.sh

VDF_FILENAME="app_1992810"

head_content=$(git symbolic-ref HEAD 2>/dev/null)
export git_branch="${head_content##refs/heads/}"
export GIT_COMMIT_HASH=$(git rev-parse HEAD)
sed "s/\$GIT_BRANCH/$git_branch/g" $VDF_FILENAME.template.vdf > $VDF_FILENAME.vdf
sed "s/\$GIT_COMMIT_HASH/$GIT_COMMIT_HASH/g" $VDF_FILENAME.vdf > $VDF_FILENAME.vdf.temp

mv $VDF_FILENAME.vdf.temp $VDF_FILENAME.vdf

cwd__=$(pwd)
VDF="$cwd__/$VDF_FILENAME.vdf"
/usr/games/steamcmd +login $USERNAME $PASSWORD +run_app_build "$VDF" +quit