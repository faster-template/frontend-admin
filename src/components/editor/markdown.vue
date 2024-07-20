<template>
  <div id="vditor" class="markdown-editor-comp-container">
    <a-skeleton animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-line :rows="10" />
      </a-space>
    </a-skeleton>
  </div>
</template>

<script setup lang="ts">
  import { debounce } from '@/utils/debounce';
  import Vditor from 'vditor';
  import 'vditor/dist/index.css';
  import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
  import { uploadFile } from '@/api/upload';
  import { getFileTypeByMimeType } from '@/utils/file';

  const content = defineModel('content', {
    type: String,
    default: () => {
      return '';
    },
  });
  const vditor = ref();
  const props = defineProps({
    isHtml: {
      type: Boolean,
      default: false,
    },
  });
  const emits = defineEmits(['created']);
  onMounted(() => {
    vditor.value = new Vditor('vditor', {
      height: 500,
      width: '100%',
      resize: {
        enable: true,
      },
      mode: 'sv',
      toolbar: [
        'emoji',
        'headings',
        'bold',
        'italic',
        'strike',
        '|',
        'line',
        'quote',
        'list',
        'ordered-list',
        'check',
        'outdent',
        'indent',
        'code',
        'inline-code',
        'insert-after',
        'insert-before',
        'undo',
        'redo',
        'upload',
        'link',
        'table',
        'record',
        'edit-mode',
        'both',
        'preview',
        'outline',
        'code-theme',
        'content-theme',
        'export',
        'br',
      ],
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      upload: {
        url: '/api/upload/file',
        async handler(files: File[]) {
          const file = files[0];
          const fileType = getFileTypeByMimeType(file.type);
          if (fileType) {
            const { data: url } = await uploadFile(file, {
              oss: 'qiniu',
              folder: 'content',
            });
            vditor.value.insertValue(`${fileType === 'image' ? '!' : ''}[${file.name}](${url})`);
            return '';
          }
          return '文件格式错误';
        },
      },

      after: () => {
        const val = props.isHtml ? vditor.value.html2md(content.value) : content.value;
        vditor.value.setValue(val);
        content.value = val;
        emits('created', vditor.value);
      },
      input: debounce(
        (val) => {
          content.value = val;
        },
        500,
        false
      ),
    });
  });
  watch(
    () => content.value,
    (val) => {
      if (val !== vditor.value.getValue()) {
        vditor.value.setValue(val);
      }
    }
  );
  onBeforeUnmount(() => {
    vditor.value.destroy();
  });

  defineExpose({ vditor });
</script>

<style lang="less" scoped>
  .markdown-editor-comp-container {
    width: 100%;
    height: 100%;
  }
</style>
