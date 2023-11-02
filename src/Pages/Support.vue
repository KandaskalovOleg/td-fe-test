<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const support = computed(() => store.state.response.support);

</script>

<template>
  <div>
    <h1>Support Page</h1>
    <el-card>
      <p>
        URL: <el-link type="info" :href="support.url" target="_blank">{{ support.url }}</el-link>  
      </p>
      <p>Text: {{ support.text }}</p>
    </el-card>
  </div>
</template>

<style>
  .el-card {
    margin: 20px 0;
  }
</style>