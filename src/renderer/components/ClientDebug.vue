<template>
    <div class="container">
        <button @click="$appData.reloadClient()">Reload Client</button>
        <h1>Client Information</h1>
        <hr />
        <template v-if="$appData.Client != null">
            <h2>Product</h2>
            <pre class="code"><code>{{ JSON.stringify($appData.Client.Product, null, '    ') }}</code></pre>
            <h2>AuthR</h2>
            <pre class="code"><code>{{ JSON.stringify($appData.Client.Auth._store, null, '    ')}}</code></pre>
        </template>
        <h1>Debug Search</h1>
        <hr />
        <template v-if="$appData.Client != null">
            <md-field>
                <label>Query</label>
                <md-input v-model="search.query" />
            </md-field>
            <md-field>
                <label>Page</label>
                <md-input v-model="search.page" type="number" />
            </md-field>
            <md-field>
                <label>Maximum Page Limit</label>
                <md-input v-model="search.limit" type="number" />
            </md-field>
            <md-field>
                <label>Extra URL Parameters</label>
                <md-input v-model="search.extraParameters" />
            </md-field>
            <button @click="actionSearch()">Search</button><button @click="clearSearch()">Clear</button>
            <pre class="code"><code>{{JSON.stringify(searchResponse.content, null, '    ')}}</code></pre><br>
            <pre class="code"><code>{{JSON.stringify(searchResponse.error, null, '    ')}}</code></pre>
        </template>
    </div>
</template>
<script>
export default {
    data () {
        return {
            search: {
                query: '',
                page: 1,
                limit: 320,
                extraParameters: ''
            },
            searchResponse: {
                content: null,
                error: null
            }
        }
    },
    methods: {
        async actionSearch () {
            try
            {
                let search = await AppData.Client.Search(JSON.parse(JSON.stringify(this.$data.search)))
                console.log(`[Search Query] ${search}`)
                this.$set(this.$data.searchResponse, 'content', search.map(v => {
                    return {
                        ...v.data
                    }
                }))
            }
            catch (e)
            {
                this.$set(this.$data.searchResponse, 'error', e)
                console.error(e)
            }
        },
        clearSearch () {
            this.$set(this.$data, 'searchResponse', {
                content: null,
                error: null
            })
        }
    }
}
</script>