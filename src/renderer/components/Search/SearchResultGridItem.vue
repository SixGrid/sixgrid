<template>
    <div class="md-layout-item md-size-15" style="margin: 12px 0;">
        <md-card>
            <md-card-media-cover md-solid>
                <md-card-media>
                    <template v-if="thumbnailImage() == undefined">
                        <img src='@/assets/missing-image.png' />
                    </template>
                    <template v-else>
                        <img :width="thumbnailImage().width" :height="thumbnailImage().height" :src="thumbnailImage().url" />
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
            for (let i = 0; i < entries.length; i++) {
                if (entries[i][1].url != undefined)
                    return entries[i][1]
            }
            return undefined
        }
    }
}
</script>