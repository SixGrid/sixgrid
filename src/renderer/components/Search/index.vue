<template>
    <div class="container">
        <div ref="gridview-posts">
            <md-toolbar class="searchbar md-dense" :md-elevation="1">
                <div class="md-toolbar-row">
                    <md-field md-inline>
                        <label>Search Query</label>
                        <md-input v-model="searchQuery" md-autogrow @keyup="ValidateSearch"></md-input>
                    </md-field>
                    <md-button class="md-icon-button" ref="buttonSearchSettings">
                        <md-icon>tune</md-icon>
                    </md-button>
                </div>
            </md-toolbar>

            <search-result-grid v-bind:result="posts" />
        </div>
    </div>
</template>
<style scoped>
.container {
    width: calc(100% - 120px);
    margin: 25px;
}
</style>
<script>
import SearchResultGrid from './SearchResultGrid.vue'
export default {
  components: { SearchResultGrid },
    name: 'Search',
    data () {
        return {
            searchQuery: '',
            options: {
                page: 1,
                limit: 8
            },
            posts: []
        }
    },
    methods: {
        ValidateSearch (event) {
            let DoSubmit = event.code.toLowerCase() == 'enter'
            let SufficentLength = this.$data.searchQuery.length > 1
            let IsValid = DoSubmit && SufficentLength
            if (!IsValid) return
            console.log(`[Search->ValidateSearch] Executing Query; '${this.$data.searchQuery}'`)
            this.ExecuteSearchQuery()
        },
        async ExecuteSearchQuery () {
            let ts = Date.now()
            if (AppData.Client == null)
                AppData.reloadClient()
            let options = Object.assign({}, this.$data.options,
                {
                    query: this.$data.searchQuery
                })
            let posts = await AppData.Client.Search(options)
            this.$data.posts = {posts}
            console.log(`[Search->ExecuteSearchQuery] Took ${Date.now() - ts}ms.`, posts)
        }
    }
}
</script>
