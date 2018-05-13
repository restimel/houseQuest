<template>
<div class="error">
    The page "{{route}}" cannot be found.
    <br>
    Check the link which has bring you here...
</div>
</template>

<script>
export default {
    name: 'Menu',
    props: {
        route: String,
    },
};
</script>

<style scoped>
.error {
    background-color: var(--error-background);
    text-align: center;
}
</style>
