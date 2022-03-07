<template>
    <div class="container">
        <div ref="gridview-posts">
            <md-toolbar class="searchbar md-dense" :md-elevation="1">
                <div class="md-toolbar-row">
                    <md-field md-inline>
                        <label>Username</label>
                        <md-input v-model="targetUser" md-autogrow @keydown="getAllFavorites"></md-input>
                    </md-field>
                </div>
            </md-toolbar>

            <div v-bind:dt="favdb">
                <template v-if="favdb[targetUser] != undefined">
                    <div v-bind:dt="favdb[targetUser]">
                        <template v-for="postarr in Object.entries(favdb[targetUser])">
                            <search-result-grid v-bind:key="`page-${postarr[0]}`" v-bind:result="{posts: postarr[1]}" />
                        </template>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
import SearchResultGrid from './Search/SearchResultGrid.vue'
export default {
    name: 'Favorites',
    components: {SearchResultGrid},
    data () {
        return this.initialData()
    },
    methods: {
        initialData () {
            if (AppData.Client == null) AppData.reloadClient()
            return {
                favdb: {},
                targetUser: AppData.Client.Auth.Username || ``
            }
        },
        async getAllFavorites (event) {
            if (event.key.toUpperCase() != 'ENTER') return
            let targetPageCount = 1;
            let perpage = 320;
            console.log(`[Favorites->getAllFavorites] Fetching all favorites (${perpage}/page, max ${targetPageCount} pages)`)
            if (this.$data.favdb[this.$data.targetUser] == undefined) {
                this.$data.favdb[this.$data.targetUser] = {}
            }

            for (let i = 0; i < targetPageCount; i++) {
                let opts = {
                    query: `fav:${this.$data.targetUser}`,
                    limit: perpage,
                    page: i + 1
                }
                console.log(`[Favorites->getAllFavorites] Sending Query; tags=${opts.query} limit=${opts.limit} page=${opts.page}`)
                let posts = await AppData.Client.Search(opts)
                if (posts.length < perpage) {
                    targetPageCount = i + 1;
                }
                this.$data.favdb[this.$data.targetUser][i.toString()] = posts
                console.log(`[Favorites->getAllFavorites] Page:${opts.page} with ${posts.length} posts.`, posts)
            }
        }
    }
}
</script>