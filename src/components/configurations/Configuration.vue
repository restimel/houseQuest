<template>
    <section>
        <header><h1>Configuration</h1></header>
        <label class="configuration-item">
            Theme:
            <select v-model="conf.theme">
                <option v-for="item of themes"
                    :key="'theme-' + item.name"
                    :value="item.value"
                >
                    {{item.name}}
                </option>
            </select>
        </label>
        <label class="configuration-item"
            title="If the number of result find in the compositor reach this value, it then stops the comptation."
        >
            Maximum number of results:
            <input type="number" v-model="conf.resultLimitation" min="1">
        </label>
    </section>
</template>
<script>
import conf from '@/models/configurations';

export default {
    name: 'Configuration',
    data: function() {
        return {
            conf: conf,
            themes: [{
                name: 'Default',
                value: 'default',
            }, {
                name: 'Blueprint',
                value: 'blueprint',
            }, {
                name: 'Purple',
                value: 'purple',
            }],
        };
    },
};

</script>

<style scoped>
ul {
    text-align: left;
}

.configuration-item {
    margin-bottom: 1em;
    display: block;
}
</style>
