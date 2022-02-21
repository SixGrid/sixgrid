<template>
    <div class="container">
        <ul>
            <template v-for="(route, index) in routes">
                <template v-if="route.name != undefined">
                    <li v-bind:key="index"><a :href="`#${route.path}`">{{route.name}}</a></li>
                </template>
            </template>
        </ul>
    </div>
</template>
<script>
export default {
    name: 'Debug',
    data () {
        return this.initialData()
    },
    methods: {
        initialData () {
            return {
                routes: vueJS.$router.options.routes
            }
        }
    }
}
</script>