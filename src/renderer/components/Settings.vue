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
            <template v-if="customEndpointEnable()">
                <md-list-item>
                    <md-field>
                        <label>Custom Endpoint</label>
                        <md-input v-model="pflags.customEndpoint" />
                    </md-field>
                </md-list-item>
            </template>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Authentication{{ clientParameters.auth.enable ? '' : ' (Disabled)' }}</md-subheader>
            <md-list-item>
                <md-icon>{{ clientParameters.auth.enable ? 'person' : 'person_off' }}</md-icon>
                <div class="md-list-item-text">
                    <md-checkbox v-model="clientParameters.auth.enable">Enable</md-checkbox>
                </div>
            </md-list-item>
            <md-list-item>
                <md-icon>person</md-icon>
                <md-field>
                    <label>Username</label>
                    <md-input v-model="clientParameters.auth.user" :disabled="!clientParameters.auth.enable" spellcheck="false" />
                </md-field>
            </md-list-item>
            <md-list-item>
                <md-icon>key</md-icon>
                <md-field>
                    <label>API Key</label>
                    <md-input type="password" v-model="clientParameters.auth.apikey" :disabled="!clientParameters.auth.enable" />
                </md-field>
            </md-list-item>
        </md-list>
        <md-button class="md-fab btn-save md-primary" @click="save()">
            <md-icon>save</md-icon>
        </md-button>
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
            let returnValue = {
                pflags: {
                    endpointOptions,
                    endpointOptionsSelected: endpointOptions[0].value,
                    customEndpointEnable: false,
                    customEndpoint: null
                },
                clientParameters: {
                    auth: {
                        login: '',
                        apikey: '',
                        enable: false
                    },
                    endpoint: 'https://e926.net'
                }
            }
            if (AppData.Config != null && AppData.Config.Data.clientParameters != undefined)
                returnValue.clientParameters = Object.assign({}, AppData.Config.Data.clientParameters)
            return returnValue
        },
        updateClientParameters () {
            if (this.$data.pflags.endpointOptionsSelected == null)
                this.$data.pflags.endpointOptionsSelected = this.$data.pflags.endpointOptions[0].value
            if (this.$data.pflags.endpointOptionsSelected != null) {
                if (this.customEndpointEnable()) {
                    this.$data.clientParameters.endpoint = this.$data.pflags.customEndpoint
                } else {
                    this.$data.clientParameters.endpoint = this.$data.pflags.endpointOptionsSelected
                }
            }
        },
        save() {
            let ts = Date.now()
            let data = this.toJSON()
            AppData.Config.Data.clientParameters = JSON.parse(JSON.stringify(data.clientParameters))
            AppData.Config.write()
            vueJS.$toastr.success(`Took ${Date.now() - ts}ms`, 'Settings Saved')
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
        }
    }
}
</script>