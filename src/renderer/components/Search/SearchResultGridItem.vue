<template>
    <div class="md-layout-item md-size-15">
        <div @click="postClick()" type="clickableCrap">
            <md-card>
                <md-card-media-cover md-solid>
                    <md-card-media>
                        <template v-if="thumbnailImage() == undefined || thumbnailImage().url == undefined">
                            <img src='@/assets/missing-image.png' />
                        </template>
                        <template v-else>
                            <img :width="thumbnailImage().width || 256" :height="thumbnailImage().height || 256" :src="thumbnailImage().url" :onerror="this.src = getAssetImage('missing-image.png')" />
                        </template>
                    </md-card-media>

                    <md-card-area style="padding: 0 8px;">
                        <span class="md-subhead">
                            <span :rating="post.Rating.substring(0, 1)">
                                {{ ratingmap[post.Rating.substring(0, 1).toLowerCase()] }}
                            </span>
                        </span>
                    </md-card-area>
                </md-card-media-cover>
            </md-card>
        </div>
    </div>
</template>
<style>
span[rating=e],
span[rating=q],
span[rating=s] {
    font-weight: bold;
}
span[rating=e] {
    color: #f00;
}
span[rating=q] {
    color: #e90;
}
span[rating=s] {
    color: #0a0;
}
</style>
<style>
div[type=clickableCrap] :hover {
    cursor: pointer;
}
</style>
<script>
export default {
    name: 'SearchResultGridItem',
    props: [ 'post', 'index' ],
    data () {
        return {
            ratingmap: {
                e: 'explicit',
                q: 'questionable',
                s: 'safe'
            }
        }
    },
    methods: {
        thumbnailImage() {
            let entries = Object.entries(this.post.Image)
            if (this.post.Image.Preview.url != undefined)
                return this.post.Image.Preview
            else if (this.post.Image.Sample.url != undefined)
                return this.post.Image.Sample
            else
                return undefined
        },
        getAssetImage (loc) {
            let image = require.context('../../assets/', false, /\.png$/)(`./missing-image.png`)
            try {
                image = require.context('../../assets/', false, /\.png$/)(filename)
            } catch (error) {}
            return image
        },
        postClick () {
            this.$emit('postClick', this.post)
        }
    }
}
</script>