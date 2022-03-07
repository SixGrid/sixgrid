<template>
    <div class="md-layout md-gutter md-alignment-center">
        <template v-if="result.posts != undefined">
            <template v-for="(post, index) in result.posts">
                <search-result-grid-item :post="post" :index="index" v-bind:key="`post-${index}`" />
            </template>
        </template>
    </div>
</template>
<script>
import SearchResultGridItem from './SearchResultGridItem.vue'
export default {
    name: 'SearchResultGrid',
    components: { SearchResultGridItem },
    props: [ 'result' ]
}
</script>