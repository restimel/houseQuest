<template>
<aside>
    <div v-if="noResult">
        No result selected...
    </div>
    <template v-else>
        <header><h4>
            {{villageName}}
        </h4></header>
        <div>
            <Village
                :village="village"
                display="mazeInfo"
                :changeDisplay="['maze', 'mazeInfo']"
                readonly
            />
        </div>
        <VillageAnalyze
            class="villageAnalyze"
            :result="village.analyzeResult"
        />
    </template>
    <AskDialog
        title="Save village"
        :show="askDialog"
        class="fixed"
        @close="askDialog=false"
        @confirm="checkSave"
    >
        <div>
            <input
                :class="{dialogFieldError: !villageName}"
                placeholder="Name of the village"
                v-model="villageName"
                @keyup.prevent.stop.enter="checkSave"
            >
            <div v-show="isNameUsed"
                class="dialogWarn"
            >
                House will be overwritten
            </div>
        </div>
    </AskDialog>
</aside>
</template>

<script>
import Village from '@/models/village';
import VillageView from '@/components/village/SvgVillage';
import AskDialog from '@/components/AskDialog';
import VillageAnalyze from '@/components/village/VillageAnalyze';

export default {
    name: 'VillageResultDetails',
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
                withoutAnalyze: false,
            }),
            askDialog: false,
            villageName: '',
            villageList: [],
        };
    },
    created: function () {
        this.updateResult();
    },
    computed: {
        noResult: function() {
            return !this.result || !this.result.maze && !this.result.houses;
        },
        isNameUsed: function() {
            return this.villageList.includes(this.village.name);
        },
    },
    methods: {
        updateResult: function() {
            const {maze, houses, name} = this.result || {};

            if (maze) {
                this.village.maze = maze;
            }

            if (houses) {
                this.village.houses = houses;
            } else {
                this.village.houses = [];
            }

            if (name) {
                this.villageName = name;
            } else {
                this.villageName = '';
            }
        },
        updateVillages: function() {
            this.village.getList().then(list => this.villageList = list);
        },
        save: function() {
            if (!this.noResult) {
                this.askDialog = true;
            }
        },
        checkSave: async function() {
            const name = this.villageName;
            this.village.name = name;
            this.result.name = name;
            await this.village.save();
            this.askDialog = false;
            this.updateVillages();
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
        AskDialog: AskDialog,
    },
};
</script>

<style scoped>
header,
h4 {
    margin: 0;
}
</style>
