<template>
    <div>
        <template v-if="statusResponse != null">
            <hr>
            <md-content style="padding: 1rem; margin: 1rem;" class="md-elevation-1">
                <h1>E621/E926 is currently {{statusResponse.current.state}}</h1>
                <template v-if="statusResponse.current.state == 'down'">
                    <h3>Since {{currentSince}}</h3>
                </template>
                <template v-if="statusResponse.current.note != null">
                    <h3>Notes</h3>
                    <pre><code>{{statusResponse.current.note}}</code></pre>
                </template>
            </md-content>
        </template>
    </div>
</template>
<script>
import axios from 'axios'
import * as moment from 'moment'
export default {
    name: 'EsixStatus',
    data () {
        return {
            statusResponse: null,
            logger: AppData.Log.scope('EsixStatus'),
            currentSince: ''
        }
    },
    mounted () {
        this.fetchStatusResponse()
    },
    methods: {
        async fetchStatusResponse() {
            let axiosResponse = null
            try
            {
                axiosResponse = await axios({
                    url: 'https://status.e621.ws/json',
                    method: 'GET'
                })
            }
            catch (err)
            {
                this.logger.error(`Failed to get status`, err, axiosResponse)
                return
            }
            this.statusResponse = axiosResponse.data
            this.currentSince = moment(this.statusResponse.current.since).fromNow()
        }
    }
}
</script>
