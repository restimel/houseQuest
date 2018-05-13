<template>
<nav class="menu">
    <router-link to="house" class="link">
        House
    </router-link>
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
    background-color: var(--menu-background);
}
.link {
    padding: 1em 2em;
    color: var(--menu-text-color);
    text-decoration: none;
}
.link:hover {
    color: var(--active-link);
}
.router-link-exact-active {
    background-color: var(--active-link);
    color: var(--menu-background);
}
.router-link-exact-active:hover {
    color: var(--menu-background);
}

</style>
