#!/bin/bash
head_content=$(git symbolic-ref HEAD 2>/dev/null)
export git_branch="${head_content##refs/heads/}"
export GIT_COMMIT_HASH=$(git rev-parse HEAD)
sed "s/\$GIT_BRANCH/$git_branch/g" $1.template.vdf > $1.vdf
sed "s/\$GIT_COMMIT_HASH/$GIT_COMMIT_HASH/g" $1.vdf > $1.vdf.temp

mv $1.vdf.temp $1.vdf

cwd__=$(pwd)
VDF="$cwd__/$1.vdf"
/usr/games/steamcmd +login $USERNAME $PASSWORD +run_app_build "$VDF" +quit