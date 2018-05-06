<template>
<nav class="menu">
    <router-link to="village" class="link">
        Village
    </router-link>
    <router-link to="composition" class="link">
        Composition
    </router-link>
</nav>
</template>

<script>
export default {
    name: 'Menu',
};
</script>

<style scoped>
.menu {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: rgb(50, 0, 50);
}
.link {
    padding: 1em 2em;
    color: rgb(250, 250, 250);
    text-decoration: none;
}
.link:hover {
    color: rgb(200, 200, 0);
}
.router-link-exact-active {
    background-color: rgb(200, 200, 0);
    color: rgb(50, 0, 50);
}
.router-link-exact-active:hover {
    color: rgb(50, 0, 50);
}

</style>
