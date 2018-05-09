<template>
<aside>
    <template v-if="hasSelection">
        <header>
            {{position}}
        </header>
        <label>
            House:
            <select
                v-model="houseName"
                @change="change"
            >
                <option value="_empty_">No house</option>
                <option v-for="house of houseList"
                    :key="house"
                    :value="house"
                >{{house}}</option>
            </select>
        </label>
        <label>
            Orientation:
            <select
                v-model="orientation"
                @change="change"
            >
                <option value="UP">↑</option>
                <option value="DOWN">↓</option>
                <option value="LEFT">←</option>
                <option value="RIGHT">→</option>
            </select>
        </label>
    </template>
    <div v-else
        class="defaultMsg"
    >
        Nothing selected yet...
    </div>
</aside>
</template>

<script>
import Village from '@/models/village';
import store from '@/core/indexedDB';

export default {
    name: 'HouseAction',
    props: {
        selected: {
            type: Object,
            default: function() {
                return {};
            },
        },
    },
    data: function() {
        this.refresh();
        return {
            houseName: '',
            orientation: 'UP',
            houseList: [],
        };
    },
    computed: {
        resultHouse: function() {
            return this.houseName + '§' + this.orientation;
        },
        hasSelection: function() {
            return typeof this.selected.idx === 'number';
        },
        position: function() {
            return ['North West', 'West', 'South West', 'North', 'Center', 'South', 'North East', 'East', 'South East'][this.selected.idx];
        },
    },
    methods: {
        splitSelected: function() {
            const [name, orientation] = this.selected.house.split('§');
            this.houseName = name;
            this.orientation = orientation;
        },
        change: function() {
            this.$emit('change', this.resultHouse);
        },
        refresh: async function() {
            const list = await store.house.getAll();
            this.houseList = list.map(h => h.name);
        },
    },
    watch: {
        selected: function() {
            this.splitSelected();
        },
    },
};
</script>

<style scoped>
label {
    display: block;
    margin: 0.5em;
}
.defaultMsg {
    font-style: italic;
}
</style>
