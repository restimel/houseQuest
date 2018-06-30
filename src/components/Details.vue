<template>
<div
    class="details"
    :class="{open: isOpen}"
>
    <div class="summary"
        @click="change"
    >
        <slot name="summary"/>
    </div>
    <div v-show="isOpen"
        class="body"
    >
        <slot name="body" />
    </div>
</div>
</template>

<script>
export default {
    props: {
        open: {
            type: Boolean,
            default: false,
        },
    },
    data: function() {
        return {
            isOpen: this.open,
        };
    },
    methods: {
        change: function() {
            this.isOpen = !this.isOpen;
            this.$emit('change', this.isOpen);
        },
    },
    watch: {
        open: function() {
            this.isOpen = this.open;
        },
    },
};
</script>

<style scoped>
.details {
    box-shadow: 0 2px 5px 0 black;
}

.body {
    height: 100%;
}

.summary {
    cursor: pointer;
}
</style>