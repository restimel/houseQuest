<template>
<dialog :open="show">
    <header>Weight for computing difficulties</header>
    <div class="body">
        <label v-for="(value, name) in weightValues"
            :key="name"
        >
            <span>{{name}}</span>
            <input
                type="range"
                min="0"
                max="100"
                :value="value"
                @input="changeWeight(name, $event)"
            >
            <span>{{value}}</span>
        </label>
    </div>
    <div class="controls"
        v-keys:d.escape.enter="confirm"
    >
        <button
            @click="$emit('reset')"
        >
            Reset
        </button>
        <button
            @click="confirm"
        >
            Ok
        </button>
    </div>
</dialog>
</template>

<script>

export default {
    name: 'AskDialog',
    props: {
        show: Boolean,
        weight: {
            type: Object,
            default: function() {
                return {};
            },
        }
    },
    data: function() {
        return {
            weightValues: Object.assign({}, this.weight),
        };
    },
    methods: {
        changeWeight: function(name, evt) {
            this.weightValues[name] = +evt.currentTarget.value;
            this.$emit('input', this.weightValues);
        },
        confirm: function() {
            this.$emit('confirm');
        },
    },
    watch: {
        weight: function() {
            this.weightValues = Object.assign({}, this.weight);
        },
    },
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
}
</style>