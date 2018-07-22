<template>
<div @click="$emit('click')">
    <Village
        :village="village"
        display="maze"
        :changeDisplay="false"
        readonly
    />
    <VillageAnalyze
        :result="analyzedResult"
        :village="village"
        simpleDisplay
        class="analyzeInformation"
    />
</div>
</template>

<script>
import Village from '@/models/village';
import VillageView from '@/components/village/SvgVillage';
import VillageAnalyze from '@/components/village/VillageAnalyze';

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
        const village = new Village({
            propsData: {
                withoutAnalyze: true,
            },
        });

        return {
            village: village,
        };
    },
    created: function () {
        this.updateResult();
    },
    computed: {
        analyzedResult: function() {
            return this.result.result;
        },
    },
    methods: {
        updateResult: function() {
            if (this.result.maze) {
                this.village.maze = this.result.maze;
            }
            if (this.result.houses) {
                this.village.houses = this.result.houses;
            }
            if (this.result.result) {
                this.village.result = this.result.result;
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
        VillageAnalyze: VillageAnalyze,
    },
};
</script>

<style scoped>
.analyzeInformation {
    padding: 0 0.4em;
}
</style>
