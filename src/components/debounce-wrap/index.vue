<template>
  <div ref="loadRef" class="loading-button-component-container" style="display: inline-block">
    <slot :loading="loading" :set-loading="setLoading"></slot>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue';

  const loadRef = ref();
  const loading = ref(false);
  const setLoading = (value: boolean) => {
    loading.value = value;
  };
  const onClick = (event: Event) => {
    if (loading.value) {
      event.stopImmediatePropagation();
      return;
    }
    loading.value = true;
  };
  onMounted(() => {
    loadRef.value.addEventListener('click', onClick);
  });
</script>
