<template>
    <div class="container" page="settings">
        <md-list class="md-elevation-1">
            <md-subheader>Connection Settings</md-subheader>
            <md-list-item>
                <md-icon>rss_feed</md-icon>
                <md-field>
                    <label>Endpoint</label>
                    <md-select v-model="pflags.endpointOptionsSelected">
                        <template v-for="(endpoint, index) in pflags.endpointOptions">
                            <div v-bind:key="`endpoint-select-${index}`">
                                <md-option v-bind:value="endpoint.value">
                                    {{ endpoint.text }}
                                </md-option>
                            </div>
                        </template>
                    </md-select>
                </md-field>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Authentication{{ clientParameters.auth.enabled ? '' : ' (Disabled)' }}</md-subheader>
            <md-list-item>
                <md-icon>{{ clientParameters.auth.enabled ? 'person' : 'person_off' }}</md-icon>
                <div class="md-list-item-text">
                    <md-checkbox v-model="clientParameters.auth.enabled">Enable</md-checkbox>
                </div>
            </md-list-item>
            <md-list-item>
                <md-icon>api</md-icon>
                <md-field>
                    <label>Endpoint URL</label>
                    <md-input v-model="clientParameters.endpoint" spellcheck="false" />
                </md-field>
            </md-list-item>
            <md-list-item>
                <md-icon>person</md-icon>
                <md-field>
                    <label>Username</label>
                    <md-input v-model="clientParameters.auth.login" :disabled="!clientParameters.auth.enabled" spellcheck="false" />
                </md-field>
            </md-list-item>
            <md-list-item>
                <md-icon>key</md-icon>
                <md-field>
                    <label>API Key (<a href="https://steamcommunity.com/sharedfiles/filedetails/?id=2841522348" openExternal>Tutorial</a>)</label>
                    <md-input type="password" v-model="clientParameters.auth.apikey" :disabled="!clientParameters.auth.enabled" />
                </md-field>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Downloader</md-subheader>
            <md-list-item>
                <md-icon>folder</md-icon>
                <md-field>
                    <label>Download Folder</label>
                    <md-input type="text" v-model="configFlags.downloadFolder" />
                </md-field>
                <md-button class="md-elevation-1 md-raised" @click="browseDownloadFolder()">Browse</md-button>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Content Settings</md-subheader>
            <md-list-item>
                <md-checkbox v-model="configFlags.media.autoplay">Media Autoplay</md-checkbox>
            </md-list-item>
            <md-list-item>
                <md-checkbox v-model="configFlags.media.loop">Loop Media</md-checkbox>
            </md-list-item>
            <md-list-item>
                <md-checkbox v-model="configFlags.highQualityPreview">High-quality Preview</md-checkbox>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>General</md-subheader>
            <md-list-item>
                <div class="md-list-item">
                    <md-button class="md-elevation-1 md-raised" @click="steamworks.ResetMetrics()">Reset Steam Achievement Progress</md-button>
                </div>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Debug Settings</md-subheader>
            <md-list-item>
                <div class="md-list-item-text">
                    <md-checkbox v-model="debugElementOutline">HTML Element Outline</md-checkbox>
                </div>
            </md-list-item>
        </md-list>
        <md-button class="md-fab btn-save md-primary" @click="save()">
            <md-icon>save</md-icon>
        </md-button>
        <br><br><br><br><br>
    </div>
</template>
<style>
[page=settings] .btn-save {
    position: fixed;
    bottom: 16px;
    right: 16px;
}
[page=settings] .md-list {
    margin: 8px;
}
</style>
<script>
const fs = require('fs')
export default {
    name: 'Settings',
    data () {
        return this.initialData()
    },
    methods: {
        initialData () {
            let endpointOptions = [
                { value: 'https://e926.net', text: 'e926' },
                { value: 'https://e621.net', text: 'e621' },
                { value: 'custom', text: 'Custom' }
            ]
            let data = global.AppData.CloudConfig.Authentication.get()
            let endpointOptionsNew = data.items.map((r, i) => {
                return {
                    value: i,
                    text: `${i}: ${r.endpoint}`
                }
            })
            let returnValue = {
                pflags: {
                    endpointOptions: endpointOptionsNew,
                    endpointOptionsSelected: data._current,
                    customEndpointEnable: false,
                    customEndpoint: null
                },
                configFlags: AppData.CloudConfig.User.get(),
                clientParameters: AppData.FetchClientParameters(),
                debugElementOutline: localStorage.debugElementOutline == 'true' ? true : false
            }
            if (returnValue.debugElementOutline == undefined) {
                returnValue.debugElementOutline = false
            }

            return returnValue
        },
        reloadEndpointOptions () {
            let data = global.AppData.CloudConfig.Authentication.get()
            this.$set(this.$data.pflags, 'endpointOptions', data.items.map((r, i) => {
                return {
                    value: i,
                    text: `${i}: ${r.endpoint}`
                }
            }))
        },
        updateClientParameters () {
            if (this.$data.pflags.endpointOptionsSelected == null)
                this.$data.pflags.endpointOptionsSelected = this.$data.pflags.endpointOptions[0].value
        },
        save() {
            let ts = Date.now()
            let data = this.toJSON()
            global.AppData.CloudConfig.Authentication._data.items[this.$data.pflags.endpointOptionsSelected] = JSON.parse(JSON.stringify(data.clientParameters))
            global.AppData.CloudConfig.Authentication.set('_current', this.$data.pflags.endpointOptionsSelected)
            global.AppData.CloudConfig.Authentication.write()
            if (!fs.existsSync(this.$data.configFlags.downloadFolder))
                fs.mkdirSync(this.$data.configFlags.downloadFolder, {recursive: true})
            global.AppData.CloudConfig['User'].set(JSON.parse(JSON.stringify(this.$data.configFlags)))
            global.AppData.CloudConfig['User'].write()
            vueJS.$toastr.success(`Took ${Date.now() - ts}ms`, 'Settings Saved')
            global.AppData.reloadClient()
            this.reloadEndpointOptions()
            let initialDataEntries = Object.entries(this.initialData())
            for (let i = 0; i < initialDataEntries.length; i++) {
                this.$set(this.$data, initialDataEntries[i][0], initialDataEntries[i][1])
            }
        },
        toJSON () {
            this.updateClientParameters()
            let data = {
                clientParameters: Object.assign({}, this.$data.clientParameters)
            }
            return JSON.parse(JSON.stringify(data))
        },
        customEndpointEnable () {
            let val = false
            if (this.$data.pflags.endpointOptionsSelected == null)
                val = false
            else if (this.$data.pflags.endpointOptionsSelected.value == 'custom')
                val = true
            this.$data.pflags.customEndpointEnable = val
            return val
        },
        async browseDownloadFolder () {
            let dialog = await require('electron').remote.dialog.showOpenDialog({
                defaultPath: this.$data.configFlags.downloadFolder,
                properties: ['openDirectory']
            })
            if (dialog.filePaths.length < 1) return
            this.$set(this.$data.configFlags, 'downloadFolder', dialog.filePaths[0])
        }
    },
    watch: {
        'debugElementOutline' () {
            AppData.Set('debugElementOutline', this.$data.debugElementOutline)
        },
        'pflags.endpointOptionsSelected' () {
            this.$set(this.$data, 'clientParameters', global.AppData.CloudConfig.Authentication._data.items[this.$data.pflags.endpointOptionsSelected])
        }
    },
    computed: {
        steamworks () {
            return AppData.Steamworks
        }
    }
}
</script>