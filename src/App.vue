<template>
    <div id="app">
        <Menu />
        <router-view class="page-view" />
    </div>
</template>

<script>
import Menu from '@/components/Menu';

export default {
    name: 'App',
    components: {
        Menu,
    },
};
</script>

<style>
body {
    padding: 0;
    margin: 0;
    color: var(--text-color);
}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0;
}
.page-view {
    padding: 1em;
    background-color: var(--page-background);
    overflow: auto;
    position: absolute;
    top: 50px;
    bottom: 0;
    left: 0;
    right: 0;
}
summary {
    cursor: pointer;
}
</style>

<style>
:root {
    --text-color: rgb(0, 0, 0);
    --warning-text: rgb(150, 120, 0);
    --menu-background: rgb(50, 0, 50);
    --error-background: rgb(255, 200, 200);
    --page-background: rgb(235, 230, 255);
    --village-background: rgb(250, 235, 190);
    --house-background: var(--village-background);
    --start-background: rgb(150, 250, 150);
    --start-border: rgb(0, 150, 0);
    --end-background: rgb(250, 150, 150);
    --end-border: rgb(250, 0, 0);
    --active-link: rgb(200, 200, 0);
    --menu-text-color: rgb(250, 250, 250);
    --village-border: rgb(150, 150, 150);
    --house-border: var(--village-border);
    --house-no-wall-hover: rgb(230, 210, 70);
    --house-wall: rgb(50, 0, 50);
    --house-wall-hover: rgb(200, 180, 0);
    --arrow-solution: rgb(120, 250, 120);
    --arrow-not-solution: rgb(240, 130, 100);
    --arrow-outside: rgb(250, 250, 250);
    --house-area-hover-background: rgba(250, 230, 0, 0.3);
    --house-area-hover-border: rgba(250, 230, 0, 0.7);
    --house-selected-background: rgba(250, 230, 0, 0.2);
    --house-selected-border: rgba(250, 230, 0, 0.8);
    --information-not-resolvable: rgb(255, 0, 0);
    --information-resolvable: rgb(0, 120, 0);

    --aside-left-border: 5px solid var(--menu-background);
    --aside-top-border: 1px solid var(--menu-background);
}
</style>
