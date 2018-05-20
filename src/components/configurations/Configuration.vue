<template>
    <section>
        <header><h1>Configuration</h1></header>
        <div>
            Theme:
            <select v-model="conf.theme">
                <option v-for="item of themes"
                    :key="'theme-' + item.name"
                    :value="item.value"
                >
                    {{item.name}}
                </option>
            </select>
        </div>
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
</style>
