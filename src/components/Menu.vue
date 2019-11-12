<template>
<nav class="menu">
    <router-link to="house" class="link">
        {{houseName.firstUpper()}}
    </router-link>
    <router-link to="village" class="link">
        {{villageName.firstUpper()}}
    </router-link>
    <router-link to="composition" class="link">
        Composition
    </router-link>
    <router-link to="about" class="link">
        About
    </router-link>
</nav>
</template>

<script>
import configuration from '@/configuration';

export default {
    name: 'Menu',
    data: function() {
        return {
            villageName: configuration.cubeName,
            houseName: configuration.plateName,
        };
    },

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
    cursor: default;
}
.router-link-exact-active:hover {
    color: var(--menu-background);
}

</style>
