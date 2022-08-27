#!/bin/bash

echo ""
echo "#################################"
echo "#    Copying SteamGuard Files   #"
echo "#################################"
echo ""

mkdir -p "$STEAM_HOME/config"
mkdir -p "/home/runner/Steam/config"

echo "Copying $STEAM_HOME/config/config.vdf..."
echo "$configVdf" > "$STEAM_HOME/config/config.vdf"
chmod 777 "$STEAM_HOME/config/config.vdf"

echo "Copying /home/runner/Steam/config/config.vdf..."
echo "$configVdf" > "/home/runner/Steam/config/config.vdf"
chmod 777 "/home/runner/Steam/config/config.vdf"

echo "Copying $STEAM_HOME/ssfn..."
echo "$ssfnFileContents" | base64 -d > "$STEAM_HOME/$ssfnFileName"
chmod 777 "$STEAM_HOME/$ssfnFileName"

echo "Copying /home/runner/Steam/ssfn..."
echo "$ssfnFileContents" | base64 -d > "/home/runner/Steam/$ssfnFileName"
chmod 777 "/home/runner/Steam/$ssfnFileName"

echo "Finished Copying SteamGuard Files!"
echo ""

./publish.sh || (
    echo ""
    echo "#################################"
    echo "#             Errors            #"
    echo "#################################"
    echo ""
    echo "Listing current folder"
    echo ""
    ls -alh
    echo ""
    echo "Listing logs folder:"
    echo ""
    ls -Ralph "/home/runner/Steam/logs/"
    echo ""
    echo "Displaying error log"
    echo ""
    cat "/home/runner/Steam/logs/stderr.txt"
    echo ""
    echo "Displaying bootstrapper log"
    echo ""
    cat "/home/runner/Steam/logs/bootstrap_log.txt"
)
./publish.beta.sh || (
    echo ""
    echo "#################################"
    echo "#             Errors            #"
    echo "#################################"
    echo ""
    echo "Listing current folder"
    echo ""
    ls -alh
    echo ""
    echo "Listing logs folder:"
    echo ""
    ls -Ralph "/home/runner/Steam/logs/"
    echo ""
    echo "Displaying error log"
    echo ""
    cat "/home/runner/Steam/logs/stderr.txt"
    echo ""
    echo "Displaying bootstrapper log"
    echo ""
    cat "/home/runner/Steam/logs/bootstrap_log.txt"
)
