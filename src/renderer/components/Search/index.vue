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
                    <!-- <md-autocomplete
                        @submit="ValidateSearch"
                        ref="autocomplete"
                        md-inline
                        v-bind:md-options="autoCompleteOptions"
                        v-model="searchQuery"
                        @md-opened="UpdateAutocomplete"
                        @md-changed="UpdateAutocomplete">
                        <label>Search Query</label>
                    </md-autocomplete> -->
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
            previousSearchQuery: '',
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
            reachedEnd: false,
            autoCompleteOptions: []
        }
    },
    methods: {
        showParameterModal () {
            this.$refs.ParameterModal.toggle()
        },
        ValidateSearch (event) {
            let DoSubmit = event.code.toLowerCase() == 'enter'
            let IsValid = DoSubmit
            if (!IsValid)
            {
                return
            }
            let conf = AppData.CloudConfig.User.get()

            let value = conf.tagBlacklist.map(v => '-'+v).join(' ') + ` ${this.$data.searchQuery}`

            if (conf.ratingSafe)
            {
                if (conf.ratingQuestionable && !conf.ratingExplicit)
                    value += ' -rating:e'
                else if (!conf.ratingQuestionable && conf.ratingExplicit)
                    value += ' -rating:q'
                else if (!conf.ratingQuestionable && !conf.ratingExplicit)
                    value += ' rating:s'
            }
            else
            {
                if (conf.ratingQuestionable && conf.ratingExplicit)
                    value += ' -rating:s'
                else if (conf.ratingQuestionable && !conf.ratingExplicit)
                    value += ' rating:q'
                else if (!conf.ratingQuestionable && conf.ratingExplicit)
                    value += ' rating:e'
            }

            if (conf.sortByScore)
                value += ' order:score'
            if (conf.sortByFavorite)
                value += ' order:favcount'
            this.$set(this.$data, 'targetSearchQuery', value)
            console.log(`[Search->ValidateSearch] Executing Query; '${this.$data.targetSearchQuery}'`)
            this.ExecuteSearchQuery()
        },
        async UpdateAutocomplete () {
            if (AppData.Client == null) AppData.reloadClient()
            console.log(this.$refs.autocomplete)
            let data = await AppData.Client.FetchAutocomplete('name_matches', this.searchQuery)
            this.$set(this.$data, 'previousSearchQuery', this.searchQuery)
            this.$set(this.$data, 'autoCompleteOptions', data.map(v => v.name))
            return this.autoCompleteOptions
        },
        // async calculateAutocomplete () {
        //     console.log('attempting autocomplete')
        //     if (AppData.Client == null) AppData.reloadClient()
        //     if (this.previousSearchQuery == this.searchQuery)
        //         return;
        //     if (this.searchQuery.length < 3)
        //         return;
        //     let data = await AppData.Client.FetchAutocomplete('name_matches', this.searchQuery)
        //     this.$set(this.$data, 'previousSearchQuery', this.searchQuery)
        //     this.$set(this.$data, 'autoCompleteOptions', data.map(v => v.name))
        //     this.autoCompleteOptions = data.map(v => v.name)
        // },
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
            console.log(`[Search->postClick]`, post)
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
