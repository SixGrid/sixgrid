const defaultData = {
    debugElementOutline: false
}

let entries = Object.entries(defaultData)
for (let i = 0; i < entries.length; i++) {
    if (localStorage[entries[i][0]] == undefined) {
        localStorage[entries[i][0]] = entries[i][1]
    }
}