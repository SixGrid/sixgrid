
AppData.tempStoreEventEmitter.on('debugElementOutline', (value) => {
    localStorage.debugElementOutline = value
    if (value) {        
        document.querySelector('html').setAttribute('outline', 'yes')
    } else {
        document.querySelector('html').setAttribute('outline', 'no')
    }
})
AppData.Set('debugElementOutline', localStorage.debugElementOutline == 'true' ? true : false)