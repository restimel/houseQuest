<template>
<div @click="$emit('click')">
    <Village
        :village="village"
        :display="{
            path: 1,
            info: false,
        }"
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
                withoutAnalyze: false,
                forceAnalyze: false,
                result: this.result.result,
            },
        });
        village.$on('analyze:done', (result) => this.analyzedResult = result);

        return {
            village: village,
            analyzedResult: {},
        };
    },
    created: function () {
        this.updateResult();
    },
    methods: {
        updateResult: function() {
            const result = this.result;

            if (result.maze) {
                this.village.maze = result.maze;
            }
            if (result.houses) {
                this.village.houses = result.houses;
            }
            if (result.result) {
                this.village.result = result.result;
                this.analyzedResult = result.result;
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
