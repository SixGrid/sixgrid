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

            <search-result-grid :result="testdata" />
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
            posts: [],
            testdata: require('../../../posts.json')
        }
    },
    methods: {
        ValidateSearch (event) {
            let DoSubmit = event.code.toLowerCase() == 'enter'
            let SufficentLength = this.$data.searchQuery.length > 1
            let IsValid = DoSubmit && SufficentLength
            if (!IsValid) return
        }
    }
}
</script>
