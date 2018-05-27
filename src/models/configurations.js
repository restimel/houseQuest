import Vue from 'vue';
import store from '@/core/indexedDB';

const Configuration = Vue.component('Configuration', {
    data: function() {
        return {
            theme: 'default',
            villageName: '',
            houseName: '',
            timeByMaze: 1,

            isLoaded: store.configuration.getAll().then(this.load.bind(this)),
        };
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
    watch: {
        theme: function()  {
            this.updater('theme');
        },
        villageName: function () {
            this.updater('villageName');
        },
        houseName: function () {
            this.updater('houseName');
        },
        timeByMaze: function () {
            this.updater('timeByMaze');
        },
    },
});

const cfg = new Configuration();

export default cfg;
