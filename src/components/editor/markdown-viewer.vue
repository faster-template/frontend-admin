<template>
  <div ref="viewRef" class="editor-comp-md-v-container"></div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import * as marked from 'marked';
  import DOMPurify from 'dompurify';

  const props = defineProps({
    content: {
      type: String,
    },
  });
  const viewRef = ref();
  onMounted(() => {
    viewRef.value.innerHTML = DOMPurify.sanitize(marked.parse(props.content as string));
  });
</script>

<style lang="less" scoped>
  .editor-comp-md-v-container {
  }
</style>
