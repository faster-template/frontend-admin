<template>
  <div ref="viewRef" class="editor-comp-md-v-container">
    <a-skeleton animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-line :rows="3" />
        <a-skeleton-shape />
      </a-space>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
  import VditorPreview from 'vditor/dist/method.min';
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    content: {
      type: String,
    },
  });
  const viewRef = ref();
  onMounted(() => {
    VditorPreview.preview(viewRef.value, props.content, {});
  });
</script>
