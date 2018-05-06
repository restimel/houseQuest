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
    background-color: rgba(255, 190, 190, 0.95);
    text-align: center;
}
</style>
