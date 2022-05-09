#!/bin/bash
cd ..
npm i
npm i --prefix lib
cd steampipe
source secret.sh
cwd__=$(pwd)
VDF="$cwd__/app_1992810.vdf"
steamcmd +login $USERNAME $PASSWORD +run_app_build "$VDF" +quit