<template>
    <div class="container">
        <md-empty-state
            md-rounded
            md-icon="public_off"
            md-label="dafuq?"
            :md-description="`Route Not Found\n'${currentRoute.path}'`" />
    </div>
</template>
<script>
export default {
    name: 'NotImplemented',
    data () {
        return {
            currentRoute: vueJS.$route
        }
    }
}
</script>