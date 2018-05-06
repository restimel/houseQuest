<template>
<div class="sharedArea">
    <header>
        <h2>{{ title }}</h2>
    </header>
    <input
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
    
    <Village :village="village" />
    <aside>
        Action
    </aside>
    <aside>
        Analyze
    </aside>
    <div class="controls">
        <button
            @click="save"
        >
            Save
        </button>
    </div>
</div>
</template>

<script>
//import worker from '@/core/worker';
import store from '@/core/indexedDB';
import Village from '@/models/village';
import VillageView from '@/components/village/SvgVillage';

export default {
    name: 'VillageEditor',
    data: function() {
        var village = new Village();

        store.village.getAll().then((list) => {
            this.villageList = list.map(v => v.name);
            this.load(this.villageList[0]);
        });

        return {
            village: village,
            villageList: [],
            selection: '',
        };
    },
    computed: {
        title: function() {
            return this.village.name || '';
        },
    },
    methods: {
        load: async function(name) {
            console.log(name);
            const has = await store.village.has(name);
            if (has) {
                this.village.get(name);
            }
        },
        save: function() {
            console.log('TODO: ask for name');
        },
    },
    components: {
        Village: VillageView,
    }
};
</script>

<style scoped>
.sharedArea {
    display: grid;
    grid-template:
        "header headerSelector" 30px
        "svg action" 1fr
        "svg analyze" 1fr
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
