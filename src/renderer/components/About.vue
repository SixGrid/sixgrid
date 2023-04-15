<template>
    <div class="container">
        <h1>Sixgrid {{ packageJSON.version }}</h1>
        <div id="contributers">
            <h3>Contributors</h3>
            <template v-for="contrib in contributers">
                <md-avatar v-bind:key="contrib[0]" style="margin: 15px;" class="md-avatar-icon md-medium md-accent">
                    <img :src="contrib[1]" :alt="contrib[0]">
                    <md-tooltip md-direction="bottom">{{contrib[0]}}</md-tooltip>
                </md-avatar>
            </template>
        </div>
        <h3>Credits</h3>
        <md-list>
            <md-list-item>
                <div><a href="https://e621.net/users/Donovan_DMC" openExternal>Donovan_DMC</a> for the Status API (status.e621.ws)</div>
            </md-list-item>
        </md-list>
        <div class="packages">
            <h3>Dependencies</h3>
            <md-table>
                <md-table-row>
                    <md-table-head>Name</md-table-head>
                    <md-table-head>Version</md-table-head>
                </md-table-row> 
                <template v-for="pkg in Object.entries(packageJSON.dependencies)">
                    <md-table-row v-bind:key="pkg[0]">
                        <md-table-cell>{{ pkg[0] }}</md-table-cell>
                        <md-table-cell>{{ pkg[1] }}</md-table-cell>
                    </md-table-row>
                </template>
            </md-table>
        </div>
    </div>
</template>
<style scoped>
.container {
    text-align: center;
    width: calc(100% - 120px);
    margin: 25px;
}
img {
    width: 150px;
}
</style>
<script>
export default {
    name: 'about',
    data () {
        return {
            packageJSON: require('./../../../package.json'),
            contributers: [
                ['ktwrd', 'https://avatars.githubusercontent.com/u/26735262'],
                ['zyme-xd', 'https://avatars.githubusercontent.com/u/70864817']
            ]
        }
    }
}
</script>
