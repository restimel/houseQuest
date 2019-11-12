<template>
<div class="sharedArea">
    <header>
        <h2>{{ title }}</h2>
    </header>
    <input
        v-show="villageList.length > 0"
        :placeholder="`Choose the ${villageName}`"
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
        :action="activeTool"
        :result="village.analyzeResult"
        :changeDisplay="{
            limitation: false,
            info: true,
            path: true,
        }"
        @selection="selectHouse"
        @cellSelection="selectCell"
    />
    <houseAction
        class="houseAction right-menu"
        :selected="selectedHouse"
        @change="changeHouse"
    />
    <VillageAnalyze
        class="villageAnalyze right-menu"
        :result="village.analyzeResult"
    />
    <aside class="tools left-menu">
        <header>Tools</header>
        <fieldset>
            <legend>Special cells</legend>
            <button
                :class="{
                    isActive: activeTool === 'startCell',
                }"
                @click="activeTool = activeTool === 'startCell' ? 'houseSelector' : 'startCell'"
            >
                Start
            </button>
            <button
                :class="{
                    isActive: activeTool === 'endCell',
                }"
                @click="activeTool = activeTool === 'endCell' ? 'houseSelector' : 'endCell'"
            >
                End
            </button>
        </fieldset>
        <div class="tool-explanation">
            <p v-for="message of toolMessage"
                :key="message"
            >
                {{message}}
            </p>
        </div>
    </aside>
    <div class="controls">
        <button
            :disabled="!title"
            @click="checkRemove"
        >
            <Icon icon="trash-alt" />
            Delete
        </button>
        <button
            @click="save"
        >
            <Icon icon="save" />
            Save
        </button>
        <AskDialog
            :title="`Save ${villageName}`"
            :show="askDialog"
            @close="askDialog=false"
            @confirm="checkSave"
        >
            <div>
                <input
                    :class="{dialogFieldError: !village.name}"
                    :placeholder="`Name of the ${villageName}`"
                    v-model="village.name"
                    @keyup.prevent.stop.enter="checkSave"
                >
                <div v-show="isNameUsed"
                    class="dialogWarn"
                >
                    {{houseName}} will be overwritten
                </div>
            </div>
        </AskDialog>
        <AskDialog
            :title="`Delete ${villageName}`"
            :show="askDialogRemove"
            saveButton="Delete"
            @close="askDialogRemove=false"
            @confirm="remove"
        >
            <div>
                Do you want to delete {{villageName}} "{{title}}"?
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
import configuration from '@/configuration';

const orientations = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

export default {
    name: 'VillageEditor',
    data: function() {
        this.refresh().then(() => this.load(this.villageList[0], true));

        return {
            villageName: configuration.cubeName,
            houseName: configuration.plateName,
            village: new Village({propsData: {synchronized: true}}),
            villageList: [],
            selection: '',
            askDialog: false,
            askDialogRemove: false,
            selectedHouse: {},
            activeTool: 'houseSelector', /* startCell, endCell */
        };
    },
    computed: {
        title: function() {
            return this.village.name || '';
        },
        isNameUsed: function() {
            return this.villageList.includes(this.village.name);
        },
        toolMessage: function() {
            let message = '';
            switch(this.activeTool) {
                case 'startCell':
                    message = [
                        'Add starting cell.',
                        'Click on cell again to remove a starting cell.',
                        '',
                        'Click again on tool button to stop this tool.',
                    ];
                    break;
                case 'endCell':
                    message = [
                        'Add ending cell.',
                        'Click on cell again to remove an ending cell.',
                        '',
                        'Click again on tool button to stop this tool.',
                    ];
                    break;
                case 'houseSelector':
                default:
                    message = [`Click on a ${this.houseName} area to select it.`];
                    break;
            }

            return message;
        },
    },
    methods: {
        load: async function(name, asDefault) {
            return this.village.get(name || '', asDefault);
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
            this.selectedHouse = {};
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
            if (this.activeTool !== 'houseSelector') {
                return;
            }
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
        selectCell: function({x, y, z}) {
            const id = `${x}, ${y}, ${z}`;

            switch (this.activeTool) {
                case 'startCell':
                    {
                        const starts = this.village.listStart;
                        const index = starts.indexOf(id);
                        if (index === -1) {
                            starts.push(id);
                        } else {
                            starts.splice(index, 1);
                        }
                        this.village.starts = starts;
                        break;
                    }
                case 'endCell':
                    {
                        const ends = this.village.listEnd;
                        const index = ends.indexOf(id);
                        if (index === -1) {
                            ends.push(id);
                        } else {
                            ends.splice(index, 1);
                        }
                        this.village.ends = ends;
                        break;
                    }
                default:
                    break;
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
        "header header headerSelector" 30px
        "tools svg action" 1fr
        "tools svg analyze" 2fr
        ". svg controls" 35px
        / 200px 1fr 300px;
}
header {
    grid-area: header;
}
.houseAction {
    grid-area: action;
}
.villageAnalyze {
    grid-area: analyze;
}
h2 {
    margin: 0;
}
.svg-container {
    grid-area: svg;
}
.tools {
    grid-area: tools;
}
.right-menu {
    border-left: var(--aside-left-border);
    border-top: var(--aside-top-border);
    padding: 1em;
    overflow: auto;
}
.left-menu {
    border-right: var(--aside-right-border);
    border-top: var(--aside-top-border);
    border-bottom: var(--aside-top-border);
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
.tool-explanation {
    background: var(--tool-explanation-background);
    color: var(--tool-explanation-color);
    margin-top: 1rem;
    padding: 0.5em;
    text-align: justify;
    font-size: 0.8em;
}
.tool-explanation p {
    padding: 0;
    margin: 0;
    margin-top: 0.3em;
    margin-bottom: 0.3em;
    min-height: 1em;
}
.isActive {
    background: var(--active-tool-background);
    color: var(--active-tool-color);
}
</style>
