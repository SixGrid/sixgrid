<template>
    <div class="container">
        <div class="md-layout md-gutter md-alignment-left">
            <md-table style="width: 100%" md-card>
                <thead>
                    <md-table-row>
                        <md-table-head></md-table-head>
                        <md-table-head>Location</md-table-head>
                        <md-table-head>Trigger</md-table-head>
                        <md-table-head></md-table-head>
                    </md-table-row>
                </thead>
                <tbody>
                    <template v-for="(script, index) in scripts">
                        <md-table-row v-bind:key="`script-list-item-${index}`">
                            <md-table-cell>
                                <md-checkbox v-model="script.enabled" />
                            </md-table-cell>
                            <md-table-cell>
                                <md-field>
                                    <md-input v-model="script.path" readonly />
                                </md-field>
                            </md-table-cell>
                            <md-table-cell>
                                <md-field>
                                    <md-input v-model="script.trigger" />
                                </md-field>
                            </md-table-cell>
                            <md-table-cell>
                                <md-button class="md-icon-button md-accent" @click="removeScript(index)">
                                    <md-icon>delete</md-icon>
                                </md-button>
                            </md-table-cell>
                        </md-table-row>
                    </template>
                </tbody>
            </md-table>
        </div>
    </div>
</template>
<script>
export default {
    name: 'ScriptManager',
    data () {
        return this.initialData()
    },
    methods: {
        initialData () {
            return {
                scripts: [
                    {
                        path: 'C:\\test-script.js',
                        enabled: false,
                        trigger: 'Post.Fetch.URL'
                    }
                ]
            }
        },

        removeScript (index) {
            let newScripts = []
            for (let i = 0; i < this.$data.scripts.length; i++)
            {
                if (i != index)
                    newScripts.push(this.$data.scripts[i])
            }
            this.$set(this.$data, 'scripts', newScripts)
        }
    }
}
</script>