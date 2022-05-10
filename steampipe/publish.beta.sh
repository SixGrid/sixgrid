#!/bin/bash
cd ..
npm i
npm i --prefix lib
npm run build:wintux
cd steampipe
source secret.sh
cwd__=$(pwd)
VDF="$cwd__/app_1993420.vdf"
/usr/games/steamcmd +login $USERNAME $PASSWORD +run_app_build "$VDF" +quit
