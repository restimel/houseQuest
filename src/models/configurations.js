import Vue from 'vue';
import store from '@/core/indexedDB';

const Configuration = Vue.component('Configuration', {
    data: function() {
        this.toWatch = [
            'theme', 'villageName', 'houseName', 'timeByMaze',
            'defaultInfo', 'infos', 'resultLimitation',
            'CSVseparator', 'CSVcolumns', 'groupThreshold'
        ];

        return {
            theme: 'default',
            villageName: '',
            houseName: '',
            timeByMaze: 5000, // nb by ms
            defaultInfo: null,
            infos: [],
            resultLimitation: 1500,
            CSVseparator: ',',
            CSVcolumns: ['result.difficultyPercent', 'houses'],
            groupThreshold: 80,

            isLoaded: store.configuration.getAll().then(this.load.bind(this)),
        };
    },
    created: function() {
        this.toWatch.forEach((attribute) => {
            this.$watch(attribute, () => this.updater(attribute));
        });
    },
    methods: {
        load: function(data) {
            data.forEach(v => {
                this[v.type] = v.data || v.weight;
            });
        },
        updater: function(attribute) {
            store.configuration.set(attribute, {
                type: attribute,
                data: this[attribute],
            });
        },
    },
});

const cfg = new Configuration();

export default cfg;
