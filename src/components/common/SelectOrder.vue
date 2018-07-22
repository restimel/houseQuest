<template>
<div class="selectorder">
    <div class="display-values">
        <div v-for="(selected, idx) of internalValue"
            class="displayed-item"
            :key="'selected-' + gid + selected"
        >
            <span>{{optionsMap.get(selected)}}</span>
            <span class="item-control">
                <Icon icon="long-arrow-alt-up"
                    class="interactive-area"
                    :class="{disabled: idx === 0}"
                    title="Click to move this column up"
                    @click="up(selected)"
                />
                <Icon icon="long-arrow-alt-down"
                    class="interactive-area"
                    :class="{disabled: idx === internalValue.length - 1}"
                    title="Click to move this column down"
                    @click="down(selected)"
                />
                <Icon icon="times"
                    class="interactive-area"
                    title="Click to remove this column"
                    @click="drop(selected)"
                />
            </span>
        </div>
    </div>
    <label>
        <Icon icon="plus" /> Add another column
        <input
            type="text"
            v-model="inputValue"
            :list="dataListId"
            placeholder="Column name"
            @change="changeValue"
            @keydown.enter="changeValue"
            @keydown.esc="inputValue = ''"
            ref="columnAdder"
        >
    </label>

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
import Vue from 'vue';
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
    },
    data: function() {
        return {
            internalValue: Array.from(this.value),
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
            return this.optionsList.filter((o) => !this.internalValue.includes(o.id));
        },

        dataListId: function() {
            return `dataList-selectOrder-${this.gid}`;
        },
    },
    methods: {
        addColumn: function() {
            this.showColumnAdder = true;
        },
        up: function(id) {
            const idx = this.internalValue.indexOf(id);
            if (idx > 0) {
                this.internalValue.splice(idx, 1);
                this.internalValue.splice(idx - 1, 0, id);
            }
        },
        down: function(id) {
            const idx = this.internalValue.indexOf(id);
            if (idx >= 0 && idx < this.internalValue.length - 1) {
                this.internalValue.splice(idx, 1);
                this.internalValue.splice(idx + 1, 0, id);
            }
        },
        changeValue: function() {
            const value = this.inputValue;

            if (!value && !this.optionsMap.has(value)) {
                return;
            }

            this.internalValue.push(value);
            this.update();
            this.inputValue = '';
        },
        drop: function(id) {
            const idx = this.internalValue.indexOf(id);

            if (idx >= 0) {
                this.internalValue.splice(idx, 1);
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
            this.internalValue = Array.from(this.value);
        },
    },
};
</script>

<style scoped>
    .display-values {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
    .displayed-item {
        border: var(--selected-item-border);
        padding: 0.2em 1em;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
    .item-control > * {
        margin-left: 0.25em;
    }
</style>