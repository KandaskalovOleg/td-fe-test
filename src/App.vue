<script setup lang="ts">
import { useStore } from 'vuex';
import AppHeader from './components/AppHeader.vue';
import { computed, onMounted } from 'vue';

const store = useStore();
const isLoading = computed(() => store.state.loadingStatus);

const checkLocalStorage = () => {
  const data = localStorage.getItem('storageData');
  if (data) {
    store.dispatch('loadDataFromStorage');
  } else {
    store.dispatch('fetchData')
  }
};

onMounted(() => {
  checkLocalStorage();
});
</script>

<template>
  <p v-if="isLoading">
    Loading...
  </p>
  <el-container v-else>
    <el-header>
      <AppHeader />
    </el-header>
    <el-main>
      <RouterView />
    </el-main>
  </el-container>
</template>

<style>
  .el-container {
    max-width: 1440px;
    margin: 0 auto;
  }
</style>