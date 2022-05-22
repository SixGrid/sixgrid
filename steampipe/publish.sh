#!/bin/bash
if [ "$#" -gt 0 ]
then
    if [ $1 == "1" ]
    then
        cd ..
        npm i
        npm i --prefix lib
        npm run build:wintux
        cd steampipe
    fi
fi
source secret.sh

VDF_FILENAME="app_1992810"

./publish.generic.sh $VDF_FILENAME