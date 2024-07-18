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
  import { IEditorConfig } from '@wangeditor/editor';
  import { uploadFile } from '@/api/upload';

  type InsertImageFnType = (url: string, alt: string, href: string) => void;
  type InsertVideoFnType = (url: string, poster: string) => void;
  // 内容 HTML
  const valueHtml = defineModel('content', { type: String, default: '' });
  // 编辑器实例，必须用 shallowRef
  const editorRef = shallowRef();
  const toolbarConfig = {};
  const editorConfig: Partial<IEditorConfig> = {
    placeholder: '请输入内容...',
    MENU_CONF: {
      uploadImage: {
        server: '/api/upload/file',
        maxFileSize: 5 * 1024 * 1024,
        maxNumberOfFiles: 9,
        // 自定义上传
        async customUpload(file: File, insertFn: InsertImageFnType) {
          await uploadFile(file, { folder: 'content' }).then(({ data }) => {
            insertFn(data, file.name, '');
          });
        },
      },
      uploadVideo: {
        server: '/api/upload/file',
        maxFileSize: 5 * 1024 * 1024, // 5M // 单个文件的最大体积限制，默认为 10M
        // 最多可上传几个文件，默认为 5
        maxNumberOfFiles: 1,
        // 自定义上传
        async customUpload(file: File, insertFn: InsertVideoFnType) {
          await uploadFile(file, { folder: 'content' }).then(({ data }) => {
            insertFn(data, '');
          });
        },
      },
    },
  };
  const mode = 'default';
  // 组件销毁时，也及时销毁编辑器
  onBeforeUnmount(() => {
    const editor = editorRef.value;
    if (editor == null) return;
    editor.destroy();
  });
  const emits = defineEmits(['created']);
  const handleCreated = (editor) => {
    editorRef.value = editor; // 记录 editor 实例，重要！
    emits('created', editor);
  };
</script>

<style lang="less" scoped>
  .editor-comp-container {
    border: 1px solid #eee;
  }
</style>
