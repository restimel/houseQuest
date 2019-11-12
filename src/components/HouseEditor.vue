<template>
<div class="sharedArea">
    <header>
        <h2>{{ title }}</h2>
    </header>
    <input
        v-show="houseList.length > 0"
        :placeholder="`Choose the ${houseName}`"
        list="houseList"
        :value="selection"
        @change="load($event.currentTarget.value)"
    >
    <datalist id="houseList">
        <option v-for="name of houseList"
            :key="'house-'+name"
            :value="name"
        ></option>
    </datalist>

    <House :house="house" />
    <aside class="options">
        Options
    </aside>
    <div class="controls">
        <button
            :disabled="!title"
            @click="checkRemove"
        >
            <Icon icon="trash-alt" />
            Remove
        </button>
        <button
            @click="init"
        >
            <Icon icon="eraser" />
            Reset
        </button>
        <button
            @click="save"
        >
            <Icon icon="save" />
            Save
        </button>
        <AskDialog
            :title="`Save ${houseName}`"
            :show="askDialog"
            @close="askDialog=false"
            @confirm="checkSave"
        >
            <div>
                <input
                    :class="{dialogFieldError: !house.name}"
                    :placeholder="`Name of the ${houseName}`"
                    v-model="house.name"
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
            :title="`Delete ${houseName}`"
            :show="askDialogRemove"
            saveButton="Delete"
            @close="askDialogRemove=false"
            @confirm="remove"
        >
            <div>
                Do you want to delete {{houseName}} "{{title}}"?
            </div>
        </AskDialog>
    </div>
</div>
</template>

<script>
import store from '@/core/indexedDB';
import House from '@/models/house';
import HouseView from '@/components/house/SvgHouse';
import AskDialog from '@/components/AskDialog';
import configuration from '@/configuration';

export default {
    name: 'HouseEditor',
    data: function() {
        this.refresh().then(() => this.load(this.houseList[0], true));

        return {
            house: new House({props: {synchronized: {default: true}}}),
            houseList: [],
            selection: '',
            askDialog: false,
            askDialogRemove: false,
            houseName: configuration.plateName,
        };
    },
    computed: {
        title: function() {
            return this.house.name || '';
        },
        isNameUsed: function() {
            return this.houseList.includes(this.house.name);
        },
    },
    methods: {
        init: function() {
            this.house.initMaze();
            this.house.name = '';
            this.house.orientation = 'UP';
        },
        load: async function(name, asDefault) {
            const has = await store.house.has(name);
            if (has) {
                this.house.get(name, asDefault);
            }
        },
        refresh: async function() {
            const list = await store.house.getAll()

            this.houseList = list.map(v => v.name);
        },
        save: async function() {
            this.askDialog = true;
        },
        checkSave: async function() {
            if (!this.house.name) {
                return;
            }
            await this.house.save();
            this.refresh();
            this.askDialog = false;
        },
        checkRemove: function() {
            this.askDialogRemove = true;
        },
        remove: async function() {
            await this.house.delete();
            this.refresh();
            this.askDialogRemove = false;
        },
    },
    created: function() {
        if (!this.house.name) {
            this.init();
        }
    },
    components: {
        House: HouseView,
        AskDialog: AskDialog,
    }
};
</script>

<style scoped>
.sharedArea {
    display: grid;
    grid-template:
        "header headerSelector" 30px
        "svg options" 1fr
        "svg controls" 35px
        / 1fr 300px;
}
header {
    grid-area: header;
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
}
.options {
    grid-area: options;
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
