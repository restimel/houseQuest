<template>
<div @click="$emit('click')">
    <Village
        :village="village"
        display="maze"
        :changeDisplay="false"
        readonly
    />
</div>
</template>

<script>
import Village from '@/models/village';
import VillageView from '@/components/village/SvgVillage';

export default {
    name: 'VillageResult',
    props: {
        result: {
            type: Object,
            default: function() {
                return {};
            },
        },
    },
    data: function() {
        return {
            village: new Village({
                withoutAnalyze: true,
            }),
        };
    },
    created: function () {
        this.updateResult();
    },
    computed: {
    },
    methods: {
        updateResult: function() {
            if (this.result.maze) {
                this.village.maze = this.result.maze;
            }
            if (this.result.houses) {
                this.village.houses = this.result.houses;
            }
        },
    },
    watch: {
        result: function() {
            this.updateResult();
        },
    },
    components: {
        Village: VillageView,
    },
};
</script>

<style scoped>
</style>
