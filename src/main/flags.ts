import { app } from 'electron'
import * as os from 'os'

export default {
    customUrlEnable: app.commandLine.hasSwitch('url'),
    customUrl: app.commandLine.getSwitchValue('url'),

    winUrl_dev: 'http://localhost:9080',
    get winUrl() {
        if (this.debugMode && this.customUrlEnable)
        {
            return this.customUrlEnable ? this.customUrl : this.winUrl_dev
        }
        else
        {
            return process.env.NODE_ENV === 'development' ? this.winUrl_dev : `file://${__dirname}/index.html`
        }
    },

    debugMode: app.commandLine.hasSwitch('developer'),

    get isSteamDeck() {
        return os.release().toString().includes('valve') || app.commandLine.hasSwitch('deck')
    }
}