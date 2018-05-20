import Vue from 'vue';
import store from '@/core/indexedDB';

const Configuration = Vue.component('Configuration', {
    data: function() {
        store.configuration.getAll().then(this.load.bind(this));
        return {
            theme: 'default',
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
    },
});

const cfg = new Configuration();

export default cfg;
