<template>
<dialog :open="show">
    <header>{{title}}</header>
    <div class="body">
        <slot />
    </div>
    <div class="controls"
        v-keys:allfocus.escape="close"
        v-keys:allfocus.enter="confirm"
    >
        <button
            @click="close"
        >
            {{cancelButton}}
        </button>
        <button
            @click="confirm"
        >
            {{saveButton}}
        </button>
    </div>
</dialog>
</template>

<script>

export default {
    name: 'AskDialog',
    props: {
        title: String,
        saveButton: {
            type: String,
            default: 'Save',
        },
        cancelButton: {
            type: String,
            default: 'Cancel',
        },
        show: Boolean,
    },
    data: function() {
        return {
        };
    },
    methods: {
        close: function() {
            this.$emit('close')
        },
        confirm: function() {
            this.$emit('confirm')
        },
    },
};
</script>

<style scoped>
dialog.fixed {
    /* position: fixed; */
    top: 33%;
    /* left: 50%; */
    transform: translate(-50%, -50%);
    margin-top: 0;
}

header {
    font-size: 1.2em;
    margin-bottom: 1em;
}

.controls {
    margin-top: 1em;
}
</style>
<style>
.dialogFieldError {
    background-color: var(--error-background);
}
.dialogWarn {
    color: var(--warning-text);
}
</style>