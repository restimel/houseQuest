<template>
<aside>
    <header>
        {{position}}
    </header>
    <label>
        House:
        <multiSelect
            v-model="houseNames"
            :options="houseList"
            title="Limit request with these houses"
            @input="change"
        />
    </label>
    <label>
        Orientation:
        <multiSelect
            v-model="orientations"
            :options="orientationOptions"
            title="Limit request with these directions"
            @input="change"
        />
    </label>
</aside>
</template>

<script>
import store from '@/core/indexedDB';
import MultiSelect from '@/components/common/MultiSelect';

export default {
    name: 'HouseSelector',
    props: {
        selected: {
            type: Object,
            default: function() {
                return {};
            },
        },
        list: {
            type: Array,
        },
    },
    data: function() {
        if (!this.list) {
            this.refresh();
        }
        return {
            houseNames: [],
            orientations: [],
            houseList: this.list || [],
            orientationOptions: [{
                id: 'UP',
                text: '↑',
            }, {
                id: 'DOWN',
                text: '↓',
            }, {
                id: 'LEFT',
                text: '←',
            }, {
                id: 'RIGHT',
                text: '→',
            }],
        };
    },
    computed: {
        resultHouse: function() {
            return {
                houses: this.houseNames,
                orientations: this.orientations,
            };
        },
        hasSelection: function() {
            return typeof this.selected.idx === 'number';
        },
        position: function() {
            return ['North West', 'West', 'South West', 'North', 'Center', 'South', 'North East', 'East', 'South East'][this.selected.idx] || 'Default';
        },
    },
    created: function() {
        this.extractData();
    },
    methods: {
        extractData: function() {
            this.houseNames = this.selected.info.houses;
            this.orientations = this.selected.info.orientations;
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
            this.extractData();
        },
        list: function() {
            this.houseList = this.list;
        },
    },
    components: {
        MultiSelect,
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
