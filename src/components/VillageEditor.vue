<template>
<div>
    TODO Village {{ village.name }}
</div>
</template>

<script>
import worker from '@/core/worker';
import Village from '@/models/village';

export default {
    name: 'VillageEditor',
    data: function() {
        var village = new Village();
        console.dir(village);
        village.get('toto43');
        // village.save();
        return {
            village: village,
        };
    },
};
</script>

<style scoped>
</style>
