<template>
    <div action="FullscreenResult">
        <div v-bind:show="visibility ? 'yes' : 'no'">
            <template v-if="true">
                <div class="fullscreenContainer">
                    <table action="postResult">
                        <tr action="img">
                            <td action="post_prev">
                                <template v-if="postIndex > 0">
                                    <div action="previous" class="hasclick" @click="prevPost()">
                                        <md-icon>arrow_back</md-icon>
                                    </div>
                                </template>
                            </td>
                            <template v-if="postArr[postIndex] != undefined">
                                <td action="postImage" v-bind:style="`max-height: ${getScreenHeight() - 120}px; max-width: ${getScreenWidth() - 200}px; --img-width: ${postArr[postIndex].Image.File.width > getScreenWidth() - 200 ? getScreenWidth() - 200 : postArr[postIndex].Image.File.width}px; --img-height: ${postArr[postIndex].Image.File.height > getScreenHeight() - 120 ? getScreenHeight() - 120 : postArr[postIndex].Image.File.height}px;`">
                                    <img :src="postArr[postIndex].Image.File.url" />
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
                        <tr action="toolbar">
                            <td></td>
                            <td>
                                <div action="close" class="hasclick" @click="setVis(false)">
                                    <md-icon>close</md-icon>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </table>
                </div>
            </template>
        </div>
    </div>
</template>
<style>
[action=FullscreenResult] [show=yes] {
    display: block;
}
[action=FullscreenResult] [show=no] {
    display: none;
}
.hasclick:hover {
    cursor: pointer;
}
.fullscreenContainer {
    position: fixed;
    top: 0%;
    left: 0%;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);

    z-index: 100;
}
.fullscreenContainer table[action=postResult] tr[action=img] {
    height: calc(var(--screen-height) - 100px);
}
.fullscreenContainer table[action=postResult] tr {
    width: 100vw;
    display: table-row;
}
.fullscreenContainer table[action=postResult] tr[action=toolbar],
.fullscreenContainer table[action=postResult] tr[action=toolbar] td,
.fullscreenContainer table[action=postResult] tr[action=toolbar] th {
    height: 100px;
}

.fullscreenContainer table[action=postResult] tr[action=toolbar] td [action=close] {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}
.fullscreenContainer table[action=postResult] tr[action=toolbar] td [action=close],
.fullscreenContainer table[action=postResult] tr[action=toolbar] td [action=close] i {
    width: 3rem;
    height: 3rem;
    font-size: 3rem !important;
}
.fullscreenContainer table[action=postResult] tr td {
    width: 100px;
    display: table-cell;
}
.fullscreenContainer table[action=postResult] tr [action=post_prev],
.fullscreenContainer table[action=postResult] tr [action=post_prev] div,
.fullscreenContainer table[action=postResult] tr [action=post_next],
.fullscreenContainer table[action=postResult] tr [action=post_next] div {
    width: 100px !important;
    max-width: 100px;
    min-width: 100px;
}
.fullscreenContainer table[action=postResult] tr [action=postImage] {
    width: calc(var(--img-width));
}
.fullscreenContainer table[action=postResult] tr [action=postImage] img {
    align-content: center;
    max-height: inherit;
    display: block;
    margin-left: auto;
    margin-right: auto;
    /* margin-left: calc(((var(--screen-width) - 200px) / 2) - (var(--img-width) / 4)); */
}
</style>
<script>
export default {
    name: 'FullscreenResult',
    data () {
        return this.initialData()
    },
    methods: {
        initialData() {
            return {
                visibility: false,
                postIndex: 0,
                postArr: []
            }
        },
        setVis(target) {
            this.$set(this.$data, 'visibility', target)
        },
        setPostIndex(index) {
            this.$set(this.$data, 'postIndex', index)
            console.log(this.$data.postIndex)
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
        }
    }
}
</script>