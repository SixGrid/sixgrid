<template>
    <div v-bind:show="visibility ? 'yes' : 'no'">
        <div class="fullscreenContainer">
            <span>tee hee</span>

            <div class="md-alignment-center-space-between md-layout md-gutter sg-toolbar-bottom">
                <div class="md-layout-item"></div>
                <div class="md-layout-item">
                    <div action="close"><md-icon>close</md-icon></div>
                </div>
                <div class="md-layout-item"></div>
            </div>
        </div>
    </div>
</template>
<style scoped>
div[show=yes] {
    display: block;
}
div[show=no] {
    display: none;
}
</style>
<style>
.fullscreenContainer {
    position: fixed;
    top: 0%;
    left: 0%;

    width: 100vw;
    height: 100vh;

    background-color: rgba(0, 0, 0, 0.5);

    z-index: 100;
}
.sg-toolbar-bottom > .md-layout-item > div[action=close]  {
    width: calc((100vw - 2rem) / 3);
    padding-left: calc((((100vw - 2rem) / 3) / 2) - 1.5rem);
    padding-right: calc((((100vw - 2rem) / 3) / 2));
}
.sg-toolbar-bottom > .md-layout-item > div[action=close] > i {
    font-size: 3rem !important;
}
.sg-toolbar-bottom > .md-layout-item {
    height: 3rem;
}
.sg-toolbar-bottom {
    position: fixed;
    bottom: 0;
    left: 0;

    width: calc(100vw - 2rem);
    height: 3rem;

    margin-left: 1rem;
    margin-right: 1rem;
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
        },
        setPosts(arr) {
            this.$set(this.$data, 'postArr', arr)
        }
    }
}
</script>