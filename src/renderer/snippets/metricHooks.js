
function incrementUncaughtException() {
    if (AppData.Steamworks != undefined) {
        AppData.MetricManager.Increment('uncaughtException')
    }
}
process
.on('unhandledRejection', () => {incrementUncaughtException(...arguments)})
.on('uncaughtException', () => {incrementUncaughtException(...arguments)})