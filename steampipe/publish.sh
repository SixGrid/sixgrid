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
if [ -f "secret.sh" ]; then; source secret.sh; fi;

VDF_FILENAME="app_1992810"

./publish.generic.sh $VDF_FILENAME