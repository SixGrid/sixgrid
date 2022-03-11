<template>
    <div>
        <md-content class="bigboxbtn">
            <div action="contentBackground">
                <span>Search</span>
            </div>
            <md-icon>search</md-icon>
        </md-content>
    </div>
</template>
<style>
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
export default {
    name: 'home'
}
</script>
