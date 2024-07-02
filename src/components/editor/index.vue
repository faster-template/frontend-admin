<template>
  <div class="editor-comp-container">
    <Toolbar
      style="border-bottom: 1px solid #ccc"
      :editor="editorRef"
      :default-config="toolbarConfig"
      :mode="mode"
    />
    <Editor
      v-model="valueHtml"
      style="height: 500px; overflow-y: hidden"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>

<script setup lang="ts">
  import '@wangeditor/editor/dist/css/style.css'; // 引入 css
  import { onBeforeUnmount, shallowRef } from 'vue';
  // eslint-disable-next-line import/no-unresolved
  import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

  // 内容 HTML
  const valueHtml = defineModel('content', { type: String, default: '' });
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();
  const toolbarConfig = {};
  const editorConfig = { placeholder: '请输入内容...' };
  const mode = 'default';
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });

  const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
  };
</script>

<style lang="less" scoped>
  .editor-comp-container {
    border: 1px solid #eeeeee;
  }
</style>
