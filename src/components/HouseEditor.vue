<template>
<div class="sharedArea">
    <header>
        <h2>{{ title }}</h2>
    </header>
    <input
        v-show="houseList.length > 0"
        placeholder="Choose the house"
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
            @click="init"
        >
            Reset
        </button>
        <button
            @click="save"
        >
            Save
        </button>
        <AskDialog
            title="Save house"
            :show="askDialog"
            @close="askDialog=false"
            @confirm="checkSave"
        >
            <div>
                <input
                    :class="{dialogFieldError: !house.name}"
                    placeholder="Name of the house"
                    v-model="house.name"
                >
                <div v-show="isNameUsed"
                    class="dialogWarn"
                >
                    House will be overwritten
                </div>
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

export default {
    name: 'HouseEditor',
    data: function() {
        this.refresh().then(() => this.load(this.houseList[0]));

        return {
            house: new House(),
            houseList: [],
            selection: '',
            askDialog: false,
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
        load: async function(name) {
            const has = await store.house.has(name);
            if (has) {
                this.house.get(name);
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
    },
    created: function() {
        console.log('created', this.house);
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
        ". controls" 35px
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
    border-left: 5px solid rgb(50, 0, 50);
    border-top: 1px solid rgb(50, 0, 50);
}
.options {
    grid-area: options;
}
.controls {
    grid-area: controls;
    border-top: 1px solid rgb(50, 0, 50);
    padding: 5px;
    padding-bottom: 0;
}
.controls button {
    cursor: pointer;
    height: 30px;
}
</style>
