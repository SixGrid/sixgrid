# Copyright 2022 Kate Ward <kate@dariox.club> (https://kate.pet).
# SPDX-License-Identifier: 	AGPL-3.0-or-later

#!/bin/bash
echo "======================== NOTICE ========================"
echo "This build script is meant for kate's build tools. So"
echo "be warned, some things will break ;w;"
./steampipe/publish.sh
./steampipe/publish.beta.sh
