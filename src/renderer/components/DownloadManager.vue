<template>
    <div class="container">
        <pre><code>
Has Client: {{$appData.Client != null}}
        </code></pre>
        <h3>Posts</h3>
        <table>
            <tr>
                <th>ID</th>
                <th>URL</th>
                <th>Downloaded</th>
                <th>Location</th>
                <th>Hash</th>
                <th>Duration</th>
            </tr>
            <template v-for="(post, index) in posts">
                <tr v-bind:key="`post-idx-${post[0]}-${index}`">
                    <td>{{post[1].id}}</td>
                    <td>{{post[1].url}}</td>
                    <td>{{parseFloat((post[1].bytesDownloaded / post[1].bytesTotal) * 100).toFixed(3)}}%</td>
                    <td>{{post[1].fileLocation}}</td>
                    <td>{{post[1].fileHash}}</td>
                    <td>{{((post[1].completeTimestamp - post[1].timestamp) / 1000).toFixed(3)}}s</td>
                </tr>
            </template>
        </table>
    </div>
</template>
<script>
export default {
    name: 'DownloadManager',
    data () {
        return {
            posts: []
        }
    },
    mounted () {
        setTimeout(() => {
            this.initializeListeners()
        }, 500)
    },
    methods: {
        updatePosts () {
            this.$set(this.$data, 'posts', Object.entries(AppData.DownloadBridge.Posts))
        },
        async initializeListeners () {
            console.log(this)
            let updateHandle = () => {
                this.updatePosts()
            }
            let initializeListenAll = () => {
                AppData.DownloadBridge.once('post:state:update:all', () => {
                    console.log(this.$data.posts)
                    if (!this._isMounted) return
                    updateHandle()
                    initializeListenAll()
                })
            }
            let initializeListenSome = () => {
                AppData.DownloadBridge.once('post:state:update', () => {
                    console.log(this.$data.posts)
                    if (!this._isMounted) return
                    updateHandle()
                    initializeListenSome()
                })
            }
            initializeListenAll()
            initializeListenSome()
        }
    }
}
</script>