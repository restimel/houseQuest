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
    color: #2c3e50;
    margin: 0;
}
.page-view {
    padding: 1em;
}
</style>
