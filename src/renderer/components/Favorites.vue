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

            <template v-if="favdb[targetUser] == undefined || Object.entries(favdb[targetUser])[0] == undefined || Object.entries(favdb[targetUser])[0][1] == undefined || Object.entries(favdb[targetUser])[0][1].length < 1">
                <md-empty-state
                    style="margin-top: 32px;"
                    md-rounded
                    md-icon="star"
                    md-label="Nobody here but us chickens!"
                    md-description="No favorites were found under this user."/>
            </template>
            <template v-for="postarr in Object.entries(favdb[targetUser] || {})">
                <template v-if="postarr[1] != undefined">
                    <search-result-grid v-bind:key="`pagedd-${postarr[1].id}`" v-bind:result="{posts: postarr[1]}" />
                </template>
            </template>
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
                targetUser: AppData.Client.Auth.Username
            }
        },
        async getAllFavorites (event) {
            if (event.key != 'Enter') return
            let targetPageCount = 1;
            let perpage = 320;
            console.log(`[Favorites->getAllFavorites] Fetching all favorites (${perpage}/page, max ${targetPageCount} pages)`)
            if (this.$data.favdb[this.$data.targetUser] == undefined) {
                this.$set(this.$data.favdb, this.$data.targetUser, {})
            }

            for (let i = 0; i < targetPageCount; i++) {
                let opts = {
                    query: `fav:${this.$data.targetUser}`,
                    limit: perpage,
                    page: i + 1
                }
                console.log(`[Favorites->getAllFavorites] Sending Query; tags=${opts.query} limit=${opts.limit} page=${opts.page}`)
                let posts = await AppData.Client.Search(opts)
                if (posts.length < perpage - 5) {
                    console.log('oh well, time to fuck off!')
                    targetPageCount = i + 1;
                }
                this.$set(this.$data.favdb[this.$data.targetUser], i.toString(), posts)
                console.log(`[Favorites->getAllFavorites] Page:${opts.page} with ${posts.length} posts.`, posts)
            }
        }
    }
}
</script>