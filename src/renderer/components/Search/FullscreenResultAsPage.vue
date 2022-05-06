<!--
 Copyright 2022 Kate Ward <kate@dariox.club> (https://kate.pet).
 SPDX-License-Identifier: 	AGPL-3.0-or-later
-->

<template>
    <div class="fullscreen-result-page" ref="main" visible="no">
        <button @click="setVis(false)">Exit</button>
        <table>
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
                        <img ref="postImage" @load="onImageLoad" :src="postArr[postIndex].Image.File.url" visible="no"/>
                        <template v-if="!fileLoaded">
                            <h1>Loading Media</h1>
                            <h3>{{ postArr[postIndex].ID }}</h3>
                        </template>
                    </td>
                </template>
                <td action="post_next">
                    <template v-if="postIndex < postArr.length">
                        <div action="next" class="hasclick" @click="nextPost()">
                            <md-icon>arrow_forward</md-icon>
                        </div>
                    </template>
                </td>
            </tr>
        </table>
    </div>
</template>
<style scoped>
.fullscreen-result-page[visible=no],
.fullscreen-result-page {
    position: fixed;
    top: -100vh;
    left: 0;
    width: 100vw;
    height: 100vh;

    background-color: #303030;

    transition: 300ms;
    z-index: 1000000000000000000;
}
.fullscreen-result-page[visible=yes] {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;

    transition: 300ms;
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
[action=img] [action=postImage] img {
    max-width: var(--image-container-width);
    max-height: calc(var(--max-height) - 1px) !important;

    display: block;
    margin: auto;
}
[action=img] [action=postImage] img[visible=yes] {
    display: block;
}
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
</style>
<script>
const $ = require('jquery')
export default {
    name: 'FullscreenResultAsPage',
    data () {
        return this.initialData()
    },
    created () {
        console.log(this.$refs.postImage)
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
            
            console.log(this.$refs.postImage)
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
        nextPost () {
            if (this.$data.postIndex + 1 == this.$data.postArr.length)
                return

            this.$set(this.$data, 'postIndex', this.$data.postIndex + 1)
        },

        onImageLoad () {
            this.$refs.postImage.setAttribute('visible', 'yes')
            this.$set(this.$data, 'fileLoaded', true)
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
            this.$refs.postImage.setAttribute('visible', 'no')
        }
    }
}
</script>