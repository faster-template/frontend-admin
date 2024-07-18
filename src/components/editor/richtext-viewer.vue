<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="editor-comp-rt-v-container" v-html="DOMPurify.sanitize(props.content)"> </div>
</template>

<script setup lang="ts">
  import DOMPurify from 'dompurify';

  const props = defineProps({
    content: {
      type: String,
    },
  });
</script>

<style lang="less" scoped>
  .editor-comp-rt-v-container {
  }
</style>
