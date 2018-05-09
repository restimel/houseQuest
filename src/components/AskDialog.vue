<template>
<dialog :open="show">
    <header>{{title}}</header>
    <div class="body">
        <slot />
    </div>
    <div class="controls">
        <button
            @click="$emit('close')"
        >
            {{cancelButton}}
        </button>
        <button
            @click="$emit('confirm')"
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

.controls {
    margin-top: 1em;
}
</style>
<style>
.dialogFieldError {
    background-color: rgb(255, 200, 200);
}
.dialogWarn {
    color: rgb(150, 120, 0);
}
</style>