<template>
<div class="sharedArea">
    <header>
        <h2>{{ title }}</h2>
    </header>
    <input
        v-show="villageList.length > 0"
        placeholder="Choose the village"
        list="villageList"
        :value="selection"
        @change="load($event.currentTarget.value)"
    >
    <datalist id="villageList">
        <option v-for="name of villageList"
            :key="'village-'+name"
            :value="name"
        ></option>
    </datalist>

    <Village
        :village="village"
        :selected="selectedHouse"
        :result="village.analyzeResult"
        @selection="selectHouse"
    />
    <houseAction
        class="houseAction"
        :selected="selectedHouse"
        @change="changeHouse"
    />
    <VillageAnalyze
        class="villageAnalyze"
        :result="village.analyzeResult"
    />
    <div class="controls">
        <button
            :disabled="!title"
            @click="checkRemove"
        >
            Delete
        </button>
        <button
            @click="save"
        >
            Save
        </button>
        <AskDialog
            title="Save village"
            :show="askDialog"
            @close="askDialog=false"
            @confirm="checkSave"
        >
            <div>
                <input
                    :class="{dialogFieldError: !village.name}"
                    placeholder="Name of the village"
                    v-model="village.name"
                    @keyup.prevent.stop.enter="checkSave"
                >
                <div v-show="isNameUsed"
                    class="dialogWarn"
                >
                    House will be overwritten
                </div>
            </div>
        </AskDialog>
        <AskDialog
            title="Delete village"
            :show="askDialogRemove"
            saveButton="Delete"
            @close="askDialogRemove=false"
            @confirm="remove"
        >
            <div>
                Do you want to delete village "{{title}}"?
            </div>
        </AskDialog>
    </div>
</div>
</template>

<script>
import Vue from 'vue';
import store from '@/core/indexedDB';
import Village from '@/models/village';
import VillageView from '@/components/village/SvgVillage';
import HouseAction from '@/components/village/HouseAction';
import VillageAnalyze from '@/components/village/VillageAnalyze';
import AskDialog from '@/components/AskDialog';

const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh().then(() => this.load(this.villageList[0], true));

        return {
            village: new Village({props: {synchronized: {default: true}}}),
            villageList: [],
            selection: '',
            askDialog: false,
            askDialogRemove: false,
            selectedHouse: {},
        };
    },
    computed: {
        title: function() {
            return this.village.name || '';
        },
        isNameUsed: function() {
            return this.villageList.includes(this.village.name);
        },
    },
    methods: {
        load: async function(name, asDefault) {
            const has = await store.village.has(name);
            if (has) {
                this.village.get(name, asDefault);
            }
        },
        refresh: async function() {
            const list = await store.village.getAll();
            this.villageList = list.map(v => v.name);
        },
        checkRemove: function() {
            this.askDialogRemove = true;
        },
        remove: async function() {
            await this.village.delete();
            this.refresh();
            this.askDialogRemove = false;
        },
        save: function() {
            this.askDialog = true;
        },
        checkSave: async function() {
            if (!this.village.name) {
                return;
            }
            await this.village.save();
            this.refresh();
            this.askDialog = false;
        },
        selectHouse: function(house, idx) {
            if (this.selectedHouse.idx === idx) {
                const [name, orientation] = house.split('§');
                const newOrientation = orientations[(orientations.indexOf(orientation) + 1)%orientations.length];
                this.changeHouse(name + '§' + newOrientation);
            } else {
                this.selectedHouse = {
                    house: house,
                    idx: idx,
                };
            }
        },
        changeHouse: function(house) {
            Vue.set(this.village.houses, this.selectedHouse.idx, house);
            this.selectedHouse = {
                house: house,
                idx: this.selectedHouse.idx,
            };
        },
    },
    components: {
        Village: VillageView,
        AskDialog: AskDialog,
        HouseAction: HouseAction,
        VillageAnalyze: VillageAnalyze,
    }
};
</script>

<style scoped>
.sharedArea {
    display: grid;
    grid-template:
        "header headerSelector" 30px
        "svg action" 1fr
        "svg analyze" 2fr
        ". controls" 35px
        / 1fr 300px;
}
header {
    grid-area: header;
}
.houseAction {
    grid-area: action;
}
.villageAnalysis {
    grid-area: analyze;
}
h2 {
    margin: 0;
}
svg {
    grid-area: svg;
}
aside {
    border-left: var(--aside-left-border);
    border-top: var(--aside-top-border);
    padding: 1em;
    overflow: auto;
}
.controls {
    grid-area: controls;
    border-top: var(--aside-top-border);
    padding: 5px;
    padding-bottom: 0;
}
.controls button {
    cursor: pointer;
    height: 30px;
}
</style>
