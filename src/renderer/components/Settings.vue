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
            <md-subheader>Authentication{{ clientParameters.auth.enable ? '' : ' (Disabled)' }}</md-subheader>
            <md-list-item>
                <md-icon>{{ clientParameters.auth.enable ? 'person' : 'person_off' }}</md-icon>
                <div class="md-list-item-text">
                    <md-checkbox v-model="clientParameters.auth.enable">Enable</md-checkbox>
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
                    <md-input v-model="clientParameters.auth.login" :disabled="!clientParameters.auth.enable" spellcheck="false" />
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
            let data = global.AppData.CloudConfig.Authentication.get()
            let endpointOptionsNew = data.items.map((r, i) => {
                console.log(r)
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
            vueJS.$toastr.success(`Took ${Date.now() - ts}ms`, 'Settings Saved')
            global.AppData.reloadClient()
            this.reloadEndpointOptions()
            this.$set(this, '$data', this.initialData())
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
    },
    watch: {
        'debugElementOutline' () {
            AppData.Set('debugElementOutline', this.$data.debugElementOutline)
        },
        'pflags.endpointOptionsSelected' () {
            this.$set(this.$data, 'clientParameters', global.AppData.CloudConfig.Authentication._data.items[this.$data.pflags.endpointOptionsSelected])
        }
    }
}
</script>