import Vue from 'vue';
import store from '@/core/indexedDB';

const Configuration = Vue.component('Configuration', {
    data: function() {
        return {
            theme: 'default',
            villageName: '',
            houseName: '',
            isLoaded: store.configuration.getAll().then(this.load.bind(this)),
        };
    },
    methods: {
        load: function(data) {
            data.forEach(v => {
                this[v.type] = v.data || v.weight;
            });
        },
    },
    watch: {
        theme: function()  {
            store.configuration.set('theme', {
                type: 'theme',
                data: this.theme,
            });
        },
        villageName: function () {
            store.configuration.set('villageName', {
                type: 'villageName',
                data: this.villageName,
            });
        },
        houseName: function () {
            store.configuration.set('houseName', {
                type: 'houseName',
                data: this.houseName,
            });
        },
    },
});

const cfg = new Configuration();

export default cfg;
