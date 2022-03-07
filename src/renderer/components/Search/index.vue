<template>
    <div class="container">
        <fullscreen-result ref="Fullscreen" />
        <div ref="gridview-posts">
            <md-toolbar class="searchbar md-dense" :md-elevation="1">
                <div class="md-toolbar-row">
                    <md-field md-inline>
                        <label>Search Query</label>
                        <md-input spellcheck="false" v-model="searchQuery" md-autogrow @keyup="ValidateSearch"></md-input>
                    </md-field>
                    <md-button class="md-icon-button" ref="buttonSearchSettings">
                        <md-icon>tune</md-icon>
                    </md-button>
                </div>
            </md-toolbar>

            <search-result-grid v-bind:result="posts" @postSelect="postClick" />
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
import FullscreenResult from './FullscreenResult.vue'
export default {
  components: { SearchResultGrid, FullscreenResult },
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
        },
        findPostIndex(post) {
            console.log(post)
            for (let i = 0; i < this.$data.posts.posts.length; i++) {
                console.log(this.$data.posts.posts[i].ID, post.ID)
                if (this.$data.posts.posts[i].ID == post.ID) {
                    return i
                }
            }
            return null
        },
        postClick (post) {
            this.$refs.Fullscreen.setPosts(this.$data.posts.posts)
            this.$refs.Fullscreen.setPostIndex(this.findPostIndex(post))
            this.$refs.Fullscreen.setVis(true)
        }
    }
}
</script>
