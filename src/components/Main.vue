<template>
    <div>
        Welcome to the {{title}} manipulator!
    </div>
</template>

<script>
import configuration from '@/configuration';

export default {
  name: 'Main',
  data: function() {
      return {
          title: configuration.titleName,
      };
  },
};
</script>

<style scoped>
</style>
