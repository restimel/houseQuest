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
    background-color: rgb(235, 230, 255);
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
