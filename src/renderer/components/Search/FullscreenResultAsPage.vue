<template>
    <div class="fullscreen-result-page" ref="main" visible="no">
        <template v-if="postArr[postIndex] != undefined">
            <table class="img-preview">
                <tr action="img">
                    <td action="post_prev">
                        <template v-if="postIndex > 0">
                            <div action="previous" class="hasclick" @click="prevPost()">
                                <md-icon>arrow_back</md-icon>
                            </div>
                        </template>
                    </td>
                    <template v-if="postArr[postIndex] != undefined">
                        <td action="postImage" :style="`--post-width: ${postArr[postIndex].Image.File.width}px; --post-height: ${postArr[postIndex].Image.File.height}px;`">
                            <post-file-preview ref="postfile" v-bind:postArray="postArr" v-bind:postIndex="postIndex" />
                            <!-- <template v-if="postArr[postIndex].Image.File.ext == 'jpg' || postArr[postIndex].Image.File.ext == 'jpeg' || postArr[postIndex].Image.File.ext == 'png' || postArr[postIndex].Image.File.ext == 'gif'">
                                <img
                                ref="postImage"
                                @load="onPostLoad"
                                @loadeddata="onPostLoad"
                                @loadedmetadata="onPostLoad"
                                :src="postArr[postIndex].Image.File.url"
                                visible="no" />
                            </template>
                            <template v-else-if="postArr[postIndex].Image.File.ext == 'mp4' || postArr[postIndex].Image.File.ext == 'webm'">
                                <video 
                                ref="postImage"
                                @load="onPostLoad"
                                @loadeddata="onPostLoad" 
                                @loadedmetadata="onPostLoad"
                                controls="controls"
                                :poster="postArr[postIndex].Image.Preview.url || postArr[postIndex].Image.Sample.url"
                                autoplay
                                loop
                                visible="no">
                                    <source
                                    :src="postArr[postIndex].Image.File.url"
                                    :type="`video/${postArr[postIndex].Image.File.ext}`" />
                                </video>
                            </template>
                            <template v-else>
                                <h1>Unsupported file extension (<code>{{ postArr[postIndex].Image.File.ext }}</code>)</h1>
                                <h3>Post: {{ postArr[postIndex].ID }}</h3>
                            </template> -->
                            
                            <template v-if="!fileLoaded">
                                <div class="fileLoadingOverlay">
                                    <h1>Loading Media</h1>
                                    <h3>{{ postArr[postIndex].ID }}</h3>
                                </div>
                            </template>
                        </td>
                    </template>
                    <td action="post_next">
                        <template v-if="postIndex < postArr.length - 1">
                            <div action="next" class="hasclick" @click="nextPost()">
                                <md-icon>arrow_forward</md-icon>
                            </div>
                        </template>
                    </td>
                </tr>
            </table>
            <table class="img-toolbar">
                <tr action="toolbar">
                    <td align="left">
                        <ul class="fullscreen-button-list">
                            <li>
                                <a :href="`${postArr[postIndex].Client.Endpoint}/posts/${postArr[postIndex].ID}`" openExternal>Open in Browser</a>
                            </li>
                        </ul>
                    </td>
                    <td align="center">
                        <ul class="fullscreen-button-list">
                            <li @click="setVis(false)">
                                <md-icon>close</md-icon>
                            </li>
                        </ul>
                    </td>
                    <td align="right">
                        <ul class="fullscreen-button-list">
                            <li>
                                <md-icon>download</md-icon>
                            </li>
                            <li>
                                {{postIndex}}/{{postArr.length}}{{$parent.reachedEnd ? '' : '...'}}
                            </li>
                            <template v-if="postArr[postIndex].Client.Auth.Enable">
                                <li action="votedown" @click="postArr[postIndex].Client.Vote(postArr[postIndex].ID, -1)">
                                    <md-icon>arrow_downward</md-icon>
                                </li>
                                <li action="voteup" @click="postArr[postIndex].Client.Vote(postArr[postIndex].ID, 1)">
                                    <md-icon>arrow_upward</md-icon>
                                </li>
                            </template>
                        </ul>
                    </td>
                </tr>
            </table>
        </template>
    </div>
</template>
<style>
[visible=no] .fileLoadingOverlay {
    display: none;
}
.fileLoadingOverlay {
    position: fixed;
    top: calc(50vh - 100px);
    background-color: rgba(0,0,0, 0.5);
    height: 100px;
    width: 200px;
    text-align: center;
    vertical-align: middle;
    left: calc(50vw - 100px);
}
.fullscreen-result-page[visible=no],
.fullscreen-result-page {
    position: fixed;
    top: -100vh;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: #303030;

    transition: 300ms;
    z-index: 100;
}
.fullscreen-result-page[visible=yes] {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    transition: 300ms;
}
[action=votedown][enablestyle=yes] i{
    color: var(--md-theme-default-accent);
}
[action=voteup][enablestyle=yes] i{
    color: var(--md-theme-default-primary);
}

.fullscreen-button-list {
    --button-size: 40px;
}
.fullscreen-button-list,
.fullscreen-button-list li {
    list-style: none;
    display: inline;
    margin: 0;
    padding: 0;
}

.fullscreen-button-list .md-icon {
    font-size: var(--button-size) !important;
    width: var(--button-size);
    height: var(--button-size);
    transition: 70ms;

    position: relative;
    text-shadow: 0 0 8px #888888;
}
.fullscreen-button-list .md-icon:hover {
    cursor:pointer;
    transform: scale(1.1);
    transition: 70ms;
}

.img-preview {
    --height: calc(100vh - 90px);

    height: var(--height) !important;
    max-height: var(--height) !important;
}
.img-toolbar {
    --height: 90px;

    height: var(--height) !important;
    max-height: var(--height) !important;
}

[action=img] {
    --max-height: calc(100vh - 90px);
    --sidebar-width: 60px;
    height: var(--max-height) !important;
    max-height: var(--max-height);
}
[action=img] td[action=postImage] {
    --image-container-width: calc(100vw - (var(--sidebar-width) * 2));
    width: var(--image-container-width) !important;
    height: var(--max-height) !important;
}
[action=img] td[action=postImage] h1,
[action=img] td[action=postImage] h2,
[action=img] td[action=postImage] h3 {
    text-align: center;
}
[action=img] [action=postImage] video,
[action=img] [action=postImage] img {
    max-width: var(--image-container-width);
    max-height: calc(var(--max-height) - 1px) !important;

    display: block;
    margin: auto;
}
[action=img] [action=postImage] video[visible=yes],
[action=img] [action=postImage] img[visible=yes] {
    display: block;
}
[action=img] [action=postImage] video[visible=no],
[action=img] [action=postImage] img[visible=no] {
    display: none;
}

[action=img] [action=post_next],
[action=img] [action=post_prev] {
    width: var(--sidebar-width);
    height: var(--max-height);
}

[action=img] .hasclick i {
    width: var(--sidebar-width);
    height: var(--sidebar-width);
    font-size: var(--sidebar-width) !important;
}

[action=toolbar] {
    --toolbar-height: 90px;
    --toolbar-section-padding: 12px;
    --toolbar-seciton-width: calc((100vw / 3));
    height: var(--toolbar-height);
    width: 100vw;

    position: relative;
    /* top: calc(100vh - 90px);
    left: 0; */
}
[action=toolbar] td {
    width: var(--toolbar-seciton-width) !important;
    height: var(--toolbar-height) !important;
}
[action=toolbar] [align=left] {
    text-align: left;
}
[action=toolbar] [align=right] {
    text-align: right;
}
</style>
<script>
import PostFilePreview from './PostFilePreview.vue'
const $ = require('jquery')
export default {
    name: 'FullscreenResultAsPage',
    components: {PostFilePreview},
    data () {
        return this.initialData()
    },
    methods: {
        initialData() {
            return {
                visibility: false,
                postIndex: 0,
                postArr: [],
                fileLoaded: false
            }
        },
        setVis(target) {
            this.$set(this.$data, 'visibility', target)
            if (target)
                this.$refs.main.setAttribute('visible', 'yes')
            else
                this.$refs.main.setAttribute('visible', 'no')
        },
        setPostIndex(index) {
            this.$set(this.$data, 'postIndex', index)
        },
        setPosts(arr) {
            this.$set(this.$data, 'postArr', arr)
        },
        getScreenHeight () {
            return window.innerHeight
        },
        getScreenWidth () {
            return window.innerWidth
        },

        prevPost () {
            if (this.$data.postIndex - 1 < 0)
                return

            this.$set(this.$data, 'postIndex', this.$data.postIndex - 1)
        },
        async nextPost () {
            console.log(this.$data.postIndex, this.$data.postArr.length, this.$parent.$data.reachedEnd)
            if (this.$data.postIndex + 1 >= this.$data.postArr.length)
            {
                if (this.$parent.$data.reachedEnd)
                    return
            }

            this.$set(this.$data, 'postIndex', this.$data.postIndex + 1)
            if (this.$data.postIndex + 2 >= this.$data.postArr.length)
            {
                if (!this.$parent.$data.reachedEnd)
                    await this.$parent.fetchNextPage()
            }
        },

        onPostLoad () {
            setTimeout(() => {
                this.$refs.postfile.vis(true)
                this.$set(this.$data, 'fileLoaded', true)
            }, 30)
        }
    },
    watch: {
        async postIndex() {
            this.$set(this.$data, 'fileLoaded', false)
            if (this.$refs.postImage == undefined)
            {
                do
                {
                    await new Promise((resolve) => setTimeout(resolve, 10))
                }
                while(this.$refs.postImage == undefined)
            }
            this.$refs.postfile.vis(false)
        }
    }
}
</script>