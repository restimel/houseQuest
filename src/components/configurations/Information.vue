<template>
    <section>
        <header><h1>Status</h1></header>
        <ul>
            <li v-for="item of list" :key="item.name"
                :title="item.title"
            >
                <span class="item-name">
                    {{item.name}}:
                </span>
                <span class="item-value">
                    {{item.value}}
                </span>
            </li>
        </ul>
    </section>
</template>
<script>

import conf from '@/models/configurations';

export default {
    name: 'about',
    data: function() {
        return {
            data: [],
            conf: conf,
        };
    },
    computed: {
        list: function() {
            const list = [].concat(this.data);

            list.push({
                name: 'Speed analysis',
                value: this.speed,
                title: 'Number of mazes that can be analyzed in 1 second',
            });

            return list;
        },

        speed: function() {
            let speed = this.conf.timeByMaze; // (in maze / ms)
            let unit = 'k/s';

            if (speed > 1000) {
                speed /= 1000;
                unit = 'M/s';
            } else if (speed < 1) {
                speed *= 1000;
                unit = '/s';
            }

            speed = Math.round(speed * 10) / 10;
            return `${speed} ${unit}`;
        },
    },
};

</script>

<style scoped>
ul {
    text-align: left;
}
</style>
