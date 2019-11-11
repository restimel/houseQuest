<template>
    <div id="app" :class="conf.theme">
        <Menu />
        <router-view class="page-view" />
    </div>
</template>

<script>
import Vue from 'vue';
import Menu from '@/components/Menu';
import conf from '@/models/configurations';
import '@/fontAwesome';

import levenshtein from 'fast-levenshtein';

if (!levenshtein.percent) {
    levenshtein.percent = function (str1, str2) {
        const strMax = Math.max(str1.length, str2.length);

        if (strMax === 0) {
            return 100;
        }

        const dist = levenshtein.get(str1, str2);

        return ((strMax - dist) / strMax) * 100;
    };
}

export default {
    name: 'App',
    data: function() {
        return {
            conf: conf,
        };
    },
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
header {
    text-align: center;
    font-size: 1.3em;
}
.page-view {
    padding: 1em;
    background-color: var(--page-background);
    color: var(--text-color);
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
summary:focus {
    outline: none;
}
.interactive-area {
    cursor: pointer;
}
.interactive-area:not(.disabled):hover {
    color: var(--active-link);
}
button {
    cursor: pointer;
}
button[disabled],
.interactive-area.disabled {
    cursor: not-allowed;
}
.interactive-area.disabled {
    color: var(--disabled-link);
}

dialog {
    box-shadow: 5px 5px 10px black;
    padding: 1em;

    position: fixed;
    top: 50%;
    transform: translate(0, -50%);

    z-index: var(--layer-dialog);
}
</style>

<style>
:root {
    --text-color: rgb(0, 0, 0);
    --warning-text: rgb(150, 120, 0);
    --error-text: rgb(255, 70, 0);
    --info-background: rgb(140, 150, 255);
    --error-background: rgb(255, 200, 200);
    --menu-background: rgb(50, 0, 50);
    --page-background: rgb(235, 230, 255);
    --village-background: rgb(250, 235, 190);
    --house-background: var(--village-background);
    --start-background: rgb(150, 250, 150);
    --start-border: rgb(0, 150, 0);
    --end-background: rgb(250, 150, 150);
    --end-border: rgb(250, 0, 0);
    --cell-background-disabled: rgb(170, 170, 170);
    --cell-border-disabled: rgb(50, 50, 50);
    --active-link: rgb(210, 200, 0);
    --disabled-link: rgb(200, 200, 200);
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
    --active-tool-background: var(--active-link);
    --active-tool-color: var(--menu-background);

    --aside-left-border: 5px solid var(--menu-background);
    --aside-right-border: 5px solid var(--menu-background);
    --aside-top-border: 1px solid var(--menu-background);
    --selected-item-border: 3px outset var(--menu-background);

    --selected-item-background: var(--menu-background);

    --tool-explanation-background: rgba(255, 255, 255, 0.2);
    --tool-explanation-color: var(--text-color);

    /* Layers (for z-index) */
    --layer-dialog: 200;
    --layer-mask-drop: 2000;
}
</style>
<style>
.blueprint {
    --text-color: rgb(255, 255, 255);
    /* --warning-text: rgb(150, 120, 0); */
    /* --error-background: rgb(255, 200, 200); */
    --menu-background: rgb(70, 70, 200);
    --page-background: rgb(0, 0, 120);
    --village-background: rgb(0, 0, 250);
    --house-background: var(--village-background);
    /* --start-background: rgb(150, 250, 150);
    --start-border: rgb(0, 150, 0);
    --end-background: rgb(250, 150, 150);
    --end-border: rgb(250, 0, 0); */
    --active-link: rgb(190, 170, 30);
    --menu-text-color: var(--text-color);
    --village-border: rgb(250, 250, 250);
    --house-border: var(--village-border);
    --house-no-wall-hover: rgb(200, 180, 20);
    --house-wall: rgb(250, 250, 250);
    --house-wall-hover: rgb(230, 210, 70);
    /* --arrow-solution: rgb(120, 250, 120);
    --arrow-not-solution: rgb(240, 130, 100);
    --arrow-outside: rgb(250, 250, 250); */
    --house-area-hover-background: rgba(250, 250, 200, 0.5);
    --house-area-hover-border: rgba(250, 250, 0, 0.9);
    --house-selected-background: rgba(250, 250, 200, 0.3);
    --house-selected-border: rgba(250, 250, 0, 0.8);
    /* --information-not-resolvable: rgb(255, 0, 0); */
    /* --information-resolvable: rgb(0, 120, 0); */
    --active-tool-background: var(--active-link);
    --active-tool-color: var(--menu-background);

    --aside-left-border: 5px solid var(--menu-background);
    --aside-right-border: 5px solid var(--menu-background);
    --aside-top-border: 1px solid var(--menu-background);
    --selected-item-border: 4px outset var(--menu-background);

    --selected-item-background: var(--menu-background);

    /* --tool-explanation-background: rgba(255, 255, 255, 0.2); */
    --tool-explanation-color: var(--text-color);
}
</style>
