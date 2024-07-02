<template>
  <div class="category-container">
    <a-row class="category-grid" :gutter="24">
      <a-col :sm="12" :lg="6">
        <rootlist @change="rootChange"></rootlist>
      </a-col>
      <a-col :sm="12" :lg="18">
        <childrenTree :root="option.root"></childrenTree>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import rootlist from './components/rootList.vue';
  import childrenTree from './components/childrenTree.vue';

  const option = reactive({
    root: null,
  });
  const rootChange = (root) => {
    option.root = root;
  };
</script>

<style lang="less" scoped>
  .category-container {
    padding: 0 20px 20px 20px;
    .category-grid {
      :deep(.arco-empty) {
        padding: 100px 0;
      }
    }
  }
</style>
