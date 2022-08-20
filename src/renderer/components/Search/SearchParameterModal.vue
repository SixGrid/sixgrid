<template>
    <div>
        <md-dialog :md-active.sync="showModal">
            <md-dialog-title>Search Parameters</md-dialog-title>

            <md-list>
                <md-list-item>
                    <md-field>
                        <label>Rating Filter</label>
                        <md-select v-model="userConfig.ratingFilter" name="search-ratingFilter" id="search-ratingFilter">
                            <md-option value="none">No Rating Filter</md-option>
                            <md-option value="safe">Safe</md-option>
                            <md-option value="questionable">Questionable</md-option>
                            <md-option value="explicit">Explicit</md-option>
                        </md-select>
                    </md-field>
                </md-list-item>
                <md-list-item>
                    <md-card>
                        <md-card-header>
                            <div class="md-title">Preload Pages</div>
                        </md-card-header>
                        <md-card-content>
                            <md-field>
                                <label>Page Count</label>
                                <md-input v-model="userConfig.preloadCount" type="number" />
                            </md-field>
                            <md-field>
                                <label>Start Page</label>
                                <md-input v-model="userConfig.preloadStartIndex" type="number"/>
                            </md-field>
                        </md-card-content>
                        <md-card-actions>
                            <md-button @click="actionPreloadPage">Start</md-button>
                        </md-card-actions>
                    </md-card>
                </md-list-item>
                <md-list-item>
                        <md-chips v-model="userConfig.tagBlacklist" md-placeholder="Tag Blacklist" />
                </md-list-item>
            </md-list>

            <md-dialog-actions>
                <md-button class="md-primary" @click="showModal = false">Close</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
export default {
    name: 'SearchParameterModal',
    data () {
        return this.InitialData()
    },
    methods: {
        InitialData () {
            return {
                showModal: false,
                userConfig: AppData.CloudConfig.UserConfiguration.get()
            }
        },
        toggle () {
            this.$set(this.$data, 'showModal', true)
        },
        actionPreloadPage () {
            
        }
    },
    watch: {
        showModal (target) {
            if (!target) {
                AppData.CloudConfig['UserConfiguration'].set(JSON.parse(JSON.stringify(this.$data.userConfig)))
                AppData.CloudConfig['UserConfiguration'].write()
            }
        }
    }
}
</script>