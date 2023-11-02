<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const activeMenu = ref(router.currentRoute.value.path);

watchEffect(() => {
  activeMenu.value = router.currentRoute.value.path;
});
</script>

<template>
  <nav>
    <el-menu
      :default-active="activeMenu" 
      mode="horizontal"
      router= true
    >
      <el-menu-item index="/">Home</el-menu-item>
      <el-menu-item index="/users-management">Users Management</el-menu-item>
      <el-menu-item index="/support">Support</el-menu-item>
    </el-menu>
  </nav>
</template>

<style scoped>
  .el-menu-item {
    font-size: medium;
  }

  @media (max-width: 768px) {
    .el-menu-item {
      font-size: small;
    }
  }
</style>