<template>
<dialog :open="display">
    <slot name="header">
        <header>Import results from CSV</header>
    </slot>
    <div class="body">
        <label>
            File containing results:
            <input type="file"
                @change="loadFile"
            >
        </label>
        <label>
            Separator:
            <input
                type="text"
                v-model="conf.CSVseparator"
                class="small-input"
            >
        </label>

        <br>
        <div v-if="!!isFileValid"
            class="good-file"
        >
            <label>Number of results:</label>
            <output>{{lines.length - 1}}</output>
        </div>
        <div v-else-if="!datafile"
            class="wrong-file"
        >
            No file loaded
        </div>
        <div v-else-if="!hasResult"
            class="wrong-file"
        >
            File does not have data
        </div>
        <div v-else-if="!hasHouseName"
            class="wrong-file"
        >
            File cannot be parsed
        </div>

        <template v-if="!!datafile">
            <hr width="50%">
            <label>
                Start of the file
                <pre>{{this.example}}[...]</pre>
            </label>
        </template>
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
            :disabled="!isFileValid"
            @click="confirm"
        >
            Import
        </button>
    </div>
</dialog>
</template>

<script>
import conf from '@/models/configurations';
import SelectOrder from '@/components/common/SelectOrder';

export default {
    name: 'ImportVillages',
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        dragFiles: {
            type: [Object, DragEvent],
            optional: true,
        }
    },
    data: function() {
        this.objectURL = null;
        this.columns = new Array(9);
        for (let i = 0; i < 9; i++) {
            this.columns[i] = 'houses.' + i;
        }

        return {
            conf: conf,
            display: this.show,
            datafile: '',
        };
    },
    computed: {
        isFileValid: function() {
            return !!this.datafile && this.hasResult && this.hasHouseName;
        },
        hasResult: function() {
            return this.lines.length > 1;
        },
        hasHouseName: function() {
            return this.header && this.columns.every((col) => this.getColumn(col) !== -1);
        },
        example: function() {
            return this.datafile.slice(0, 255);
        },
        lines: function() {
            return this.datafile.split('\n').filter(line => line.length >= 9);
        },
        header: function() {
            return this.lines && this.splitLine(0);
        },
        columnsIndex: function() {
            return this.header && this.columns.map(col => this.getColumn(col));
        },
    },
    methods: {
        close: function() {
            this.display = false;
            this.$emit('close');
        },

        confirm: function() {
            if (!this.isFileValid) {
                return;
            }
            const results = this.lines.slice(1).map((line, idxLine) => {
                const cols = this.splitLine(idxLine + 1);
                return this.columnsIndex.map(idx => this.cleanValue(cols[idx]));
            });

            this.$emit('import', results);
            this.close();
        },

        cleanValue: function(value) {
            if (value.startsWith('"') && value.endsWith('"')) {
                return value.slice(1, -1);
            }
            return value;
        },

        readFile: function(files) {
            for (const file of files) {
                const reader = new FileReader();
                reader.onloadend = (evt) => {
                    this.datafile = evt.currentTarget.result;
                };
                reader.readAsText(file);
            }
        },

        loadFile: function(evt) {
            this.readFile(evt.currentTarget.files);
        },

        splitLine: function(idx) {
            const line = this.lines[idx] || '';

            return line.split(conf.CSVseparator);
        },

        getColumn: function(name) {
            let index = this.header.indexOf(name);

            if (index === -1) {
                index = this.header.indexOf(`"${name}"`);
            }
            return index;
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
        dragFiles: function() {
            const dragFiles = this.dragFiles;
            const files = dragFiles && dragFiles.dataTransfer && dragFiles.dataTransfer.files;

            if (files && files.length) {
                this.display = true;
                this.readFile(files);
            }
        }
    },
    components: {
    }
};
</script>

<style scoped>
dialog {
    margin-top: 25px;
    box-shadow: 5px 5px 10px black;
    padding: 1em;
}

header {
    font-size: 1.2em;
    margin-bottom: 1em;
}

label {
    display: block;
    margin-top: 0.2em;
}

.small-input {
    width: 1.5em;
}

.controls {
    margin-top: 1em;
}

.wrong-file {
    color: red;
}

</style>