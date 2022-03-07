<template>
    <div class="container" page="settings">
        <md-list class="md-elevation-1">
            <md-subheader>Connection Settings</md-subheader>
            <md-list-item>
                <md-icon>rss_feed</md-icon>
                <md-field>
                    <label>Endpoint</label>
                    <md-input v-model="parameters.endpoint" />
                </md-field>
            </md-list-item>
        </md-list>
        <md-list class="md-elevation-1">
            <md-subheader>Authentication</md-subheader>
            <md-list-item>
                <md-icon>{{ parameters.auth.enable ? 'person' : 'person_off' }}</md-icon>
                <div class="md-list-item-text">
                    <md-checkbox v-model="parameters.auth.enable">Enable</md-checkbox>
                </div>
            </md-list-item>
            <md-list-item>
                <md-icon>person</md-icon>
                <md-field>
                    <label>Username</label>
                    <md-input v-model="parameters.auth.user" :disabled="!parameters.auth.enable" spellcheck="false" />
                </md-field>
            </md-list-item>
            <md-list-item>
                <md-icon>key</md-icon>
                <md-field>
                    <label>API Key</label>
                    <md-input type="password" v-model="parameters.auth.apikey" :disabled="!parameters.auth.enable" />
                </md-field>
            </md-list-item>
        </md-list>
    </div>
</template>
<style>
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
            return {
                parameters: {
                    auth: {
                        user: '',
                        apikey: '',
                        enable: false
                    },
                    endpoint: 'https://e926.net'
                }
            }
        }
    }
}
</script>