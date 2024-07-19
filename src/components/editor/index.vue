<template>
  <div class="editor-comp-container">
    <a-radio-group
      v-model="mode"
      class="mode-radio"
      type="button"
      size="small"
      @change="onModeChange"
    >
      <a-radio value="richtext">富文本编辑</a-radio>
      <a-radio value="markdown">Markdown</a-radio>
    </a-radio-group>
    <richtext v-if="mode == 'richtext'" ref="richtextRef" v-model:content="content"></richtext>
    <markdown
      v-if="mode == 'markdown'"
      ref="markdownRef"
      v-model:content="content"
      :is-html="isHtml"
    ></markdown>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import VditorPreview from 'vditor/dist/method.min';
  import richtext from './richtext.vue';
  import markdown from './markdown.vue';

  const mode = defineModel('mode', {
    type: String,
    default: () => {
      return 'richtext';
    },
  });
  const content = defineModel('content', {
    type: String,
    default: () => {
      return '';
    },
  });
  const richtextRef = ref();
  const markdownRef = ref();
  const isHtml = ref(false);
  const onModeChange = (val) => {
    if (val === 'richtext') {
      VditorPreview.md2html(content.value, {}).then((res) => {
        content.value = res;
      });
    } else {
      isHtml.value = true;
    }
  };
</script>

<style lang="less" scoped>
  .editor-comp-container {
    width: 100%;
    height: 100%;

    .mode-radio {
      margin-bottom: 10px;
    }
  }
</style>
