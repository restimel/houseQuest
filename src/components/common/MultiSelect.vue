<template>
<div class="multiSelect">
    <div class="display-values">
        <span v-for="selected of Array.from(internalValue)"
            class="selected-item"
            title="Click to remove this item"
            :key="'selected-' + gid + selected"
            @click="drop(selected)"
        >
            {{optionsMap.get(selected)}}
        </span>
    </div>
    <input
        type="text"
        v-model="inputValue"
        :list="dataListId"
        :placeholder="placeholder"
        @change="changeValue"
    >

    <datalist :id="dataListId">
        <option v-for="option of optionsFilteredList"
            :key="dataListId+option.id"
            :value="option.id"
        >
            {{option.text}}
        </option>
    </datalist>


</div>
</template>
<script>

let gid = 0;

export default {
    props: {
        value: {
            type: Array,
            default: function() { return []; },
        },
        options: {
            type: Array,
            default: function() { return []; },
        },
        customizable: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: '',
        }
    },
    data: function() {
        return {
            internalValue: new Set(),
            inputValue: '',
            gid: gid++,
        };
    },
    computed: {
        optionsList: function() {
            return this.options.map((o) => {
                if (typeof o === 'object') {
                    return o;
                }

                return {
                        id: o,
                        text: o,
                    };
            });
        },
        optionsMap: function() {
            const opts = new Map();

            this.optionsList.forEach((o) => {
                opts.set(o.id, o.text);
            });

            return opts;
        },
        optionsFilteredList: function() {
            return this.optionsList.filter((o) => !this.internalValue.has(o.id));
        },

        dataListId: function() {
            return `dataList-multiSelect-${this.gid}`;
        },
    },
    methods: {
        changeValue: function() {
            const value = this.inputValue;

            if (!value || !this.customizable && !this.optionsMap.has(value)) {
                return;
            }

            this.internalValue.add(value);
            this.update();
            this.inputValue = '';
        },
        drop: function(id) {
            console.log('drop', id);
            if (this.internalValue.delete(id)) {
                this.update();
            }
        },
        update: function() {
            const value = Array.from(this.internalValue);
            this.$emit('input', value);
            this.$emit('change', value);
        },
    },
    watch: {
        value: function() {
            this.internalValue = new Set(this.value);
        },
    },
};
</script>

<style scoped>
    .display-values {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .selected-item {
        border-radius: 20px;
        border: var(--selected-item-border);
        padding: 0.3em;
        cursor: pointer;
    }
</style>