<template>
    <div class="container">
        <h3>Routes</h3>
        <ul>
            <template v-for="(route, index) in routes">
                <template v-if="route.name != undefined">
                    <li v-bind:key="index"><a :href="`#${route.path}`">{{route.name}}</a></li>
                </template>
            </template>
        </ul>
        <hr/>
        <h3>Flags</h3>
        <table>
            <thead>
                <tr>
                    <th>Key</th>
                    <td>State</td>
                </tr>
            </thead>
            <tbody>
                <template v-for="(pair, index) in Object.entries(featureFlags)">
                    <tr v-bind:key="index">
                        <th>
                            {{pair[0]}}
                        </th>
                        <td>
                            <template v-if="typeof pair[1] == 'string'">
                                <code>{{pair[1]}}</code>
                            </template>
                            <template v-else-if="typeof pair[1] == 'boolean'">
                                <teplate v-if="pair[1]">
                                    ✔️
                                </teplate>
                                <template v-else>
                                    ❌
                                </template>
                            </template>
                            <template v-else>
                                <code>{{pair[1]}}</code>
                            </template>
                        </td>
                    </tr>
                </template>
            </tbody>
        </table>
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
                routes: vueJS.$router.options.routes,
                featureFlags: {
                    allowSteamworks: global.AppData.Helper.AllowSteamworks(),
                    isDevMode: global.AppData.Helper.IsDevMode(),
                    isSteamDeck: global.AppData.Helper.IsSteamDeck(),
                    allowDevEndpointForMetrics: global.AppData.Helper.AllowDevEndpointForMetrics()
                }
            }
        }
    }
}
</script>