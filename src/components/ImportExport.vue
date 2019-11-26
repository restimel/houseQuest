<template>
<div class="sharedArea">
    <label class="action-message">
        {{actionMessage}}
    </label>
    <textarea
        class="import-area"
        :class="classState"
        placeholder="Import data"
        v-model="content"
        @input="hasChanged = true"
    />
    <aside class="tools right-menu">
        <header>Actions</header>
        <fieldset class="filters">
            <legend>Filter</legend>
            <label v-for="filterName of filterNames"
                :key="filterName.key"
                class="filter-choice"
            >
                <input type="radio" name="filter"
                    :checked="filter === filterName.key"
                    @change="filter = filterName.key"
                />
                {{filterName.name}}
            </label>
        </fieldset>
        <button
            class="action"
            :disabled="!hasChanged"
            @click="importData"
        >
            <Icon icon="file-import" />
            Import data
        </button>
    </aside>
    <aside class="message">
        {{message}}
    </aside>
</div>
</template>

<script>
import Vue from 'vue';
import store from '@/core/indexedDB';
import configuration from '@/configuration';

export default {
    name: 'ImportExport',
    data: function() {
        return {
            hasChanged: false,
            imported: false,
            error: false,
            message: '',
            content: '',
            filter: 'all', /* village house configuration */
        };
    },
    created() {
        this.load();
    },
    computed: {
       actionMessage() {
           if (this.hasChanged) {
               return 'Import this data';
           }
           return 'Copy paste to a file to save configuration.'
       },
       classState() {
           if (!this.hasChanged) {
               return '';
           }

           if(this.error) {
               return 'not-imported';
           }

           if (this.imported) {
               return 'imported';
           }
       },
       filterNames() {
            return [{
                key: 'all',
                name: 'all',
            }, {
                key: 'village',
                name: configuration.cubeName,
            }, {
                key: 'house',
                name: configuration.plateName,
            }, {
                key: 'configuration',
                name: 'configuration',
            }];
       },
    },
    methods: {
        async load() {
            this.content = '';
            this.message = 'loading data...';
            const filter = this.filter;
            let list;

            if (filter === 'all') {
                const allLists = await Promise.all([
                    store.configuration.getAll(),
                    store.village.getAll(),
                    store.house.getAll(),
                ]);
                list = {
                    configuration: allLists[0],
                    village: allLists[1],
                    house: allLists[2],
                };
            } else {
                list = await store[filter].getAll();
            }
            this.content = JSON.stringify(list, null, '  ');
            this.message = '';
            this.error = false;
            this.hasChanged = false;
        },
        async importData() {
            this.error = false;
            this.imported = false;
            this.message = 'Importing data...';

            // convert content to Object
            let dataObj;
            try {
                dataObj = JSON.parse(this.content);
            } catch(e) {
                this.error = 'Content is not a valid JSON.';
                return;
            }

            // convert content to object to save
            let data = {};
            if (Array.isArray(dataObj)) {
                if (this.filter === 'all') {
                    this.error = 'Please select the kind of data to import (note that you\'ll need to rewrite your change)';
                    return;
                }
                data[this.filter] = dataObj;
            } else {
                data = dataObj;
            }

            // save all data
            const promises = [];
            const filterNames = [];

            if (Array.isArray(data.village)) {
                promises.push(
                    Promise.all(data.village.map((dt) => store.village.set(dt)))
                );
                filterNames.push(this.filterNames[1].name);
            }

            if (Array.isArray(data.house)) {
                promises.push(
                    Promise.all(data.house.map((dt) => store.house.set(dt)))
                );
                filterNames.push(this.filterNames[2].name);
            }

            if (Array.isArray(data.configuration)) {
                promises.push(
                    Promise.all(data.configuration.map((dt) => store.configuration.set(dt)))
                );
                filterNames.push(this.filterNames[3].name);
            }

            if (promises.length === 0) {
                this.error = 'Nothing imported.';
                return;
            }

            await Promise.all(promises);

            this.imported = true;
            this.message = `Data in ${filterNames.join(', ')} have been imported.`;
            this.hasChanged = true;
        },
    },
    watch: {
        filter() {
            this.load();
        },
        error() {
            this.message = this.error;
        },
    },
    components: {
    }
};
</script>

<style scoped>
.sharedArea {
    display: grid;
    grid-template:
        "actionMessage action" 30px
        "import action" 1fr
        "message action" 30px
        / 1fr 300px;
}
.action-message {
    grid-area: actionMessage;
}
.message {
    grid-area: message;
}
.tools {
    grid-area: action;
}
.import-area {
    grid-area: import;
    margin: 1em;
    border: 7px solid #0000;
}
.imported {
    border-color: green;
}
.not-imported {
    border-color: red;
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
.action {
    display: block;
    cursor: pointer;
    height: 30px;
    margin: 0.3em;
}
.filters {
    text-align: left;
}
.filter-choice {
    display: block;
}

</style>
