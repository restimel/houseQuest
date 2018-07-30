<template>
<dialog :open="display">
    <slot name="header">
        <header>Export villages to CSV</header>
    </slot>
    <div class="body">
        <label>
            Separator:
            <input
                type="text"
                v-model="conf.CSVseparator"
                class="small-input"
            >
        </label>
        <label>
            Columns:
            <SelectOrder
                v-model="conf.CSVcolumns"
                :options="columnList"
            />
        </label>
        <br>
        <div>
            <label>Preview:</label>
            <textarea :value="example" readonly></textarea>
        </div>
    </div>
    <div class="controls"
        v-keys:k.enter="confirm"
        v-keys:k.escape="close"
    >
        <button
            @click="close"
        >
            cancel
        </button>
        <button
            @click="confirm"
        >
            Export
        </button>
    </div>
</dialog>
</template>

<script>
import conf from '@/models/configurations';
import SelectOrder from '@/components/common/SelectOrder';

export default {
    name: 'ExportVillages',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        list: {
            type: Array,
            optional: false,
        },
    },
    data: function() {
        this.objectURL = null;
        return {
            conf: conf,
            display: this.show,
        };
    },
    computed: {
        columnList: function() {
            let list = [];
            const item = this.list[0];

            if (item && item.result) {
                list = this.parseObject(item.result, 'result.');
            }

            list.push('houses');

            list.sort();
            return list;
        },
        columnsAttributes: function() {
            const firstItem = this.list[0];
            const columns = Array.from(this.conf.CSVcolumns).reduce((columns, column) => {
                const keys = column.split('.');
                const data = keys.reduce((value, key) => value && value[key], firstItem);

                if (data instanceof Array) {
                    if (column === 'houses') {
                        const changes = data.map((v, k) => `${column}.${k}`);
                        columns.push(...changes);
                    } else {
                        const changes = `${column}.length`;
                        columns.push(changes);
                    }
                } else if (data instanceof Set) {
                    const changes = `${column}.size`;
                    columns.push(changes);
                } else {
                    columns.push(column);
                }
                return columns;
            }, []);

            return columns;
        },
        example: function() {
            const firstItem = this.list.slice(0, 1);
            const csv = this.buildCSV(firstItem);

            return csv.split('\n')[1];
        },
    },
    methods: {
        close: function() {
            this.display = false;
            this.$emit('close');
        },

        confirm: function() {
            const csv = this.buildCSV();
            this.exportFile(csv);

            this.close();
        },

        parseObject: function(obj, prefix = '') {
            const list = [];

            for (let [attribute, value] of Object.entries(obj)) {
                list.push(prefix + attribute);
            }

            return list;
        },

        buildURLData: function(text) {
            /* revoke URL to avoid memory leaks */
            if (this.objectURL !== null) {
                URL.revokeObjectURL(this.objectURL);
            }

            const data = new Blob([text], {type: 'text/plain'});

            this.objectURL = URL.createObjectURL(data);
            return this.objectURL;
        },

        buildCSV: function(list = this.list) {
            const columns = this.columnsAttributes;
            const separator = this.conf.CSVseparator;

            let csv = columns.map(column => `"${column}"`).join(separator) + '\n';
            csv += list.map(village => {
                return columns.map(column => {
                    const keys = column.split('.');
                    let data = keys.reduce((value, key) => value && value[key], village);

                    if (typeof data !== 'number') {
                        data = `"${data}"`;
                    }
                    return data;
                }).join(separator);
            }).join('\n');

            return csv;
        },

        exportFile: function(text) {
            const link = document.createElement('a');
            link.download = 'houseQuestsResults.csv';
            link.href = this.buildURLData(text);
            document.body.appendChild(link);

            // wait for the link to be added to the document
            requestAnimationFrame(() => {
                const event = new MouseEvent('click');
                link.dispatchEvent(event);
                document.body.removeChild(link);
            });
        },
    },
    watch: {
        show: function() {
            const show = this.show;
            this.display = show;
            if (show) {
                this.$el.focus();
            }
        },
    },
    components: {
        SelectOrder: SelectOrder,
    }
};
</script>

<style scoped>
header {
    font-size: 1.2em;
    margin-bottom: 1em;
}

.controls {
    margin-top: 1em;
}
label {
    display: block;
    margin-top: 0.2em;
}

.small-input {
    width: 1.5em;
}

textarea {
    min-width: 950px;
}
</style>