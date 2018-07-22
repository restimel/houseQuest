<template>
    <section class="config-about">
        <Configuration />
        <Information />
        <About />
    </section>
</template>
<script>
import About from '@/components/configurations/About.vue';
import Configuration from '@/components/configurations/Configuration.vue';
import Information from '@/components/configurations/Information.vue';

export default {
    name: 'ConfigAbout',
    data: function() {
        return {};
    },
    components: {
        About: About,
        Configuration: Configuration,
        Information: Information,
    },
};

</script>

<style scoped>
.config-about {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}
</style>
