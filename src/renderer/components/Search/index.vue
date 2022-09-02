<template>
    <div class="container" style="padding-bottom: 5rem;">
        <fullscreen-result-as-page ref="Fullscreen" />
        <search-parameter-modal ref="ParameterModal" />
        <div ref="gridview-posts">
            <md-toolbar class="searchbar md-dense" :md-elevation="1">
                <div class="md-toolbar-row">
                    <md-field md-inline>
                        <label>Search Query</label>
                        <md-input spellcheck="false" v-model="searchQuery" md-autogrow @keyup="ValidateSearch"></md-input>
                    </md-field>
                    <md-button class="md-icon-button" @click="showParameterModal">
                        <md-icon>tune</md-icon>
                    </md-button>
                    <!-- <md-button class="md-button" @click="fetchNextPage">
                        Fetch next page
                    </md-button> -->
                </div>
            </md-toolbar>

            <template v-if="postsLoading && posts.posts.length < 1">
                <div style="text-align: center; margin-top: 15rem;">
                    <h1>{{postLoadingMessage}}</h1>
                    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
                </div>
            </template>

            <template v-if="posts.posts.length > 0">
                <search-result-grid v-bind:result="posts" @postSelect="postClick" />
            </template>
            <div style="text-align: center; position: absolute; bottom: 1rem; width: calc(100% - 120px); left: 25px;">
                <template v-if="posts.posts.length > 0">
                    <md-button @click="fetchNextPage()" v-bind:disabled="postsLoading" class="md-elevation-10 md-raised md-primary">Fetch Next Page</md-button>
                </template>
            </div>
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
import SearchParameterModal from './SearchParameterModal.vue'
export default {
  components: { SearchResultGrid, FullscreenResult, FullscreenResultAsPage, SearchParameterModal },
    name: 'Search',
    data () {
        return {
            searchQuery: '',
            targetSearchQuery: '',
            options: {
                page: 1,
                limit: 320
            },
            posts: {
                posts: []
            },
            postsLoading: false,
            postLoadingMessage: 'Fetching Query',
            reachedEnd: false
        }
    },
    methods: {
        showParameterModal () {
            this.$refs.ParameterModal.toggle()
        },
        ValidateSearch (event) {
            let DoSubmit = event.code.toLowerCase() == 'enter'
            let IsValid = DoSubmit
            if (!IsValid) return
            switch (AppData.CloudConfig.UserConfiguration.get().ratingFilter)
            {
                case 'safe':
                case 'questionable':
                case 'explicit':
                    let targetString = `rating:${AppData.CloudConfig.UserConfiguration.get().ratingFilter}`
                    let newSearchQuery = []
                    newSearchQuery.push(targetString)
                    for (var item of this.$data.searchQuery.split(' '))
                    {
                        if (!/^rating:/i.test(item) && !item.startsWith('safe') && !item.startsWith('questionable') && !item.startsWith('explicit'))
                            newSearchQuery.push(item)
                    }
                    this.$set(this.$data, 'searchQuery', newSearchQuery.join(' '))
                    break
            }
            this.$set(this.$data, 'targetSearchQuery', AppData.CloudConfig.UserConfiguration.get().tagBlacklist.map(v => '-'+v).join(' ') + ` ${this.$data.searchQuery}`)
            console.log(`[Search->ValidateSearch] Executing Query; '${this.$data.targetSearchQuery}'`)
            this.ExecuteSearchQuery()
        },
        async ExecuteSearchQuery () {
            let ts = Date.now()
            if (AppData.Client == null) AppData.reloadClient()
            let options = Object.assign({}, this.$data.options,
                {
                    query: this.$data.targetSearchQuery
                })
            this.$data.postsLoading = true
            this.$set(this.$data, 'postLoadingMessage', 'Fetching Query')
            let posts = []
            try
            {
                posts = await AppData.Client.Search(options)
            }
            catch (err)
            {
                console.error(`[Search->ExecuteSearchQuery] Failed to run AppData.Client.Search(${JSON.stringify(options)})\n`, err)
                if (err.message != undefined)
                {
                    this.$set(this.$data, 'postLoadingMessage', err.message)
                    return
                }
            }
            this.$set(this.$data, 'posts', {
                posts
            })
            console.log(`[Search->ExecuteSearchQuery] Took ${Date.now() - ts}ms (${options.query})`, posts)
            AppData.Steamworks.Metrics.search_count.value++
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
            let targetQuery = `${this.$data.targetSearchQuery} id:<${this.$data.posts.posts[this.$data.posts.posts.length - 1].ID}`
            let ts = Date.now()
            if (AppData.Client == null) AppData.reloadClient()
            let options = Object.assign({}, this.$data.options,
                {
                    query: targetQuery
                })
            this.$set(this.$data, 'postsLoading', true)
            this.$set(this.$data, 'postLoadingMessage', 'Fetching Query')
            let posts = await AppData.Client.Search(options)
            if (posts.length < 1) {
                console.log(`[Search->fetchNextPage] 0 posts left, looks like we've reached the end!`)
                this.$set(this.$data, 'reachedEnd', true)
            }
            this.$set(this.$data.posts, 'posts', this.$data.posts.posts.concat(posts))
            this.$refs.Fullscreen.setPosts(this.$data.posts.posts)
            this.$set(this.$data, 'postsLoading', false)
            console.log(`[Search->fetchNextPage] Took ${Date.now() - ts}ms (${targetQuery})`)
        }
    }
}
</script>
