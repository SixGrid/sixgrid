<template>
    <div class="md-layout-item md-size-15" style="margin: 12px 0;">
        <md-card>
            <md-card-media-cover md-solid>
                <md-card-media>
                    <img :src="post.preview.url || post.sample.url || post.file.url || '@/assets/missing-image.png'" />
                </md-card-media>

                <md-card-area style="padding: 0 8px;">
                    <span class="md-subhead">
                        <span :rating="post.rating.substring(0, 1)">
                            {{ ratingmap[post.rating.substring(0, 1).toLowerCase()] }}
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
    }
}
</script>