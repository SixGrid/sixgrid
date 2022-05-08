// Copyright 2022 Kate Ward <kate@dariox.club> (https://kate.pet).
// SPDX-License-Identifier: 	AGPL-3.0-or-later

const defaultData = {
    debugElementOutline: false
}

let entries = Object.entries(defaultData)
for (let i = 0; i < entries.length; i++) {
    if (localStorage[entries[i][0]] == undefined) {
        localStorage[entries[i][0]] = localStorage[i][1]
    }
}