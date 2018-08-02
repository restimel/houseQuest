<template>
<div @click="$emit('click')">
    <div class="similar-groups">
        <span v-if="groupLength > 1 && !isGroupedResult"
            class="interactive-area"
            @click.stop="$emit('expandGroup')"
        >
            {{groupLength}} similar results
        </span>
    </div>
    <Village
        :village="village"
        :display="{
            path: 1,
            info: false,
        }"
        :result="result.result"
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
        isGroupedResult: {
            type: Boolean,
            default: false,
        }
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
    computed: {
        groupLength: function() {
            const groupList = this.result.groupList;

            return groupList && groupList.length;
        },
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
.similar-groups {
    min-height: 1.1em;
}
</style>
