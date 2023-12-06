<template>
    <div class="container">
        <md-content style="margin: 1rem; padding: 2rem;" class="md-elevation-1">
            <div class="md-layout md-gutter md-alignment-top-center md-elevation-2 clickable-bigbutton" style="width: 40vw;">
                <div class="md-layout-item md-alignment-top-center" @click="OpenExternal('https://sixgrid.kate.pet/discord')">
                    <img class="lightmode-invert" src="@/assets/Discord-Logo-White.svg" style="width: 3rem;"/>
                    <span class="billboard-link-text">Join the SixGrid Discord</span>
                </div>
            </div>
            <div class="md-layout md-gutter md-alignment-top-center md-elevation-2 clickable-bigbutton" style="width: 40vw; margin-top: 3rem;">
                <div class="md-layout-item md-alignment-top-center" @click="OpenExternal('https://github.com/sixgrid')">
                    <img class="lightmode-invert" src="@/assets/GitHub-Mark-Light-120px-plus.png" style="width: 3rem;"/>
                    <span class="billboard-link-text">View on Github</span>
                </div>
            </div>
        </md-content>
        <e-six-status />
        <hr>
        <steam-news />
    </div>
</template>
<style>
.clickable-bigbutton:hover {
    cursor: pointer;
}

.billboard-link-text {
    font-size: 2rem;
    color: rgb(255, 255, 255);
    vertical-align: middle;
    text-align: right;
    margin-left: 3rem;
}

.md-layout-item {
    margin: 6px !important;
}

.bigboxbtn {
    width: 160px;
    height: 160px;
    text-align: center;
}
.bigboxbtn .md-icon {
    margin-top: calc((160px - 5rem) / 2);
    font-size: calc(160px - 5rem) !important;
}
.bigboxbtn [action=contentBackground] {
    margin: auto;
    width: 160px;
    height: 160px;
    padding: 0 20px;
    padding-top: calc(160px - 3rem);
    font-size: 2rem;
    position: absolute;
}
.bigboxbtn [action=contentBackground] span {
    text-align: center;

    margin-bottom: 1rem;
}
</style>
<script>
import ESixStatus from './ESixStatus.vue'
import SteamNews from './SteamNews.vue'
export default {
    name: 'home',
    components: {SteamNews, ESixStatus},
    methods: {
        OpenExternal (url) {
            global.AppData.OpenExternal(url)
        }
    }
}
</script>
