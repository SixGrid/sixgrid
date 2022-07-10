<template>
    <div>
        <template v-if="targetSelector == 'image'">
            <img
                ref="postImage"
                @load="onPostLoad"
                @loadeddata="onPostLoad"
                @loadedmetadata="onPostLoad"
                :src="postArray[postIndex].Image.File.url"
                v-bind:visible="visible ? 'yes':'no'"
            />
        </template>
        <template v-else-if="targetSelector == 'video'">
            <video
            ref="postImage"
            @load="onPostLoad"
            @loadeddata="onPostLoad"
            @loadedmetadata="onPostLoad"
            controls="controls"
            :poster="postArray[postIndex].Image.Preview.url || postArray[postIndex].Image.Sample.url"
            :autoplay="AppData.CloudConfig.UserConfiguration.get().media.autoplay"
            :loop="AppData.CloudConfig.UserConfiguration.get().media.loop"
            v-bind:visible="visible ? 'yes':'no'">
                    <source
                    :src="postArray[postIndex].Image.File.url"
                    :type="`video/${postArray[postIndex].Image.File.ext}`" />
            </video>
        </template>
        <template v-else>
            <h1>Unsupported file extension (<code>{{postArray[postIndex].Image.File.ext}}</code>)</h1>
            <h3>Post: {{postArray[postIndex].ID}}</h3>
        </template>
    </div>
</template>
<script>
export default {
    name: 'SearchPostFilePreview',
    props: {
        postArray: {
            required: true,
            default () {
                return []
            },
            type: Object|Array
        },
        postIndex: {
            required: false,
            default () {
                return -1
            },
            type: Number
        }
    },
    data () {
        return this.InitialData()
    },
    methods: {
        InitialData() {
            return {
                selectorMap: {
                    'image': ['png', 'jpg', 'jpeg', 'gif'],
                    'video': ['mp4', 'webm']
                },
                visible: false
            }
        },
        checkSelector (extension) {
            let entries = Object.entries(this.$data.selectorMap)
            for (let i = 0; i < entries.length; i++) {
                let item = entries[i]
                if (item[1].includes(extension))
                    return item[0]
            }
            return ''
        },
        vis (value) {
            this.$set(this.$data, 'visible', value)
        },
        onPostLoad (...args) {
            this.$parent.onPostLoad(...args)
        }
    },
    computed: {
        'targetSelector' () {
            if (this.postIndex < 0) {
                console.log(`[Search->FullscreenResultAsFullscreen->PostFilePreview] Post index is less than zero (${this.postIndex}) so no targetSelctor will be generated`)
                return ''
            }
            let post = this.postArray[this.postIndex]
            console.log(post)
            let extension = post.Image.File.ext
            let entries = Object.entries(this.$data.selectorMap)
            for (let i = 0; i < entries.length; i++) {
                let item = entries[i]
                if (item[1].includes(extension))
                    return item[0]
            }
            return ''
        },
        'AppData' () {
            return global.AppData
        }
    }
}
</script>