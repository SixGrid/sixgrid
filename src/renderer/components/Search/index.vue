<template>
    <div class="container">
        <fullscreen-result-as-page ref="Fullscreen" />
        <div ref="gridview-posts">
            <md-toolbar class="searchbar md-dense" :md-elevation="1">
                <div class="md-toolbar-row">
                    <md-field md-inline>
                        <label>Search Query</label>
                        <md-input spellcheck="false" v-model="searchQuery" md-autogrow @keyup="ValidateSearch"></md-input>
                    </md-field>
                    <!-- <md-button class="md-icon-button" ref="buttonSearchSettings">
                        <md-icon>tune</md-icon>
                    </md-button> -->
                    <!-- <md-button class="md-button" @click="fetchNextPage">
                        Fetch next page
                    </md-button> -->
                </div>
            </md-toolbar>

            <template v-if="postsLoading">
                <div style="text-align: center; margin-top: 15rem;">
                    <h1>Fetching Query</h1>
                    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                </div>
            </template>

            <template v-if="!postsLoading">
                <search-result-grid v-bind:result="posts" @postSelect="postClick" />
            </template>
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
import FullscreenResultAsPage from './FullscreenResultAsPage.vue'
export default {
  components: { SearchResultGrid, FullscreenResult, FullscreenResultAsPage },
    name: 'Search',
    data () {
        return {
            searchQuery: '',
            options: {
                page: 1,
                limit: 320
            },
            posts: [],
            postsLoading: false,
            reachedEnd: false
        }
    },
    methods: {
        ValidateSearch (event) {
            let DoSubmit = event.code.toLowerCase() == 'enter'
            let IsValid = DoSubmit
            if (!IsValid) return
            console.log(`[Search->ValidateSearch] Executing Query; '${this.$data.searchQuery}'`)
            this.ExecuteSearchQuery()
        },
        async ExecuteSearchQuery () {
            let ts = Date.now()
            if (AppData.Client == null) AppData.reloadClient()
            let options = Object.assign({}, this.$data.options,
                {
                    query: this.$data.searchQuery
                })
            this.$data.postsLoading = true
            let posts = await AppData.Client.Search(options)
            this.$set(this.$data, 'posts', {
                posts
            })
            console.log(`[Search->ExecuteSearchQuery] Took ${Date.now() - ts}ms (${options.query})`, posts)
            this.$data.postsLoading = false
            this.$set(this.$data, 'reachedEnd', false)
        },
        findPostIndex(post) {
            for (let i = 0; i < this.$data.posts.posts.length; i++) {
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
            console.log(post)
        },

        async fetchNextPage() {
            if (this.$data.reachedEnd) return
            let targetQuery = `${this.$data.searchQuery} id:<${this.$data.posts.posts[this.$data.posts.posts.length - 1].ID}`
            let ts = Date.now()
            if (AppData.Client == null) AppData.reloadClient()
            let options = Object.assign({}, this.$data.options,
                {
                    query: targetQuery
                })
            // this.$set(this.$data, 'postsLoading', true)
            let posts = await AppData.Client.Search(options)
            if (posts.length < 1) {
                console.log(`[Search->fetchNextPage] 0 posts left, looks like we've reached the end!`)
                this.$set(this.$data, 'reachedEnd', true)
            }
            this.$set(this.$data.posts, 'posts', this.$data.posts.posts.concat(posts))
            this.$refs.Fullscreen.setPosts(this.$data.posts.posts)
            // this.$set(this.$data, 'postsLoading', false)
            console.log(`[Search->fetchNextPage] Took ${Date.now() - ts}ms (${targetQuery})`)
        }
    }
}
</script>
