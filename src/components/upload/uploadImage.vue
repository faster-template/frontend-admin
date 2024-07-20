<template>
  <a-upload
    v-model:file-list="files"
    class="upload-image-comp-container"
    list-type="picture-card"
    :action="props.action"
    :limit="props.limit"
    image-preview
    :custom-request="customRequst"
    multiple
    @change="onChange"
    @exceed-limit="onExceedLimit"
  >
    <template #upload-button>
      <div class="arco-upload-picture-card">
        {{ props.text }}
      </div>
    </template>
  </a-upload>
</template>

<script setup lang="ts">
  import { PropType, ref, watch } from 'vue';
  import { FileItem, Message, RequestOption } from '@arco-design/web-vue';
  import { uploadFileCanAbort } from '@/api/upload';
  import { UploadOption } from '@/types/upload';

  const url = defineModel('url', {
    type: [String, Array] as unknown as () => string | string[],
    default: '',
  });
  const emits = defineEmits(['success']);
  const props = defineProps({
    data: {
      type: Object as PropType<UploadOption>,
      default: () => ({}),
    },
    defaultUrl: {
      type: [String, Array] as unknown as () => string | string[],
      default: '',
    },
    action: { type: String, default: '/upload/file' },
    text: { type: String, default: '上传' },
    limit: {
      type: Number,
      default: 1,
    },
    width: {
      type: String,
      default: '80px',
    },
    height: {
      type: String,
      default: '80px',
    },
  });
  const files = ref([] as FileItem[]);

  const initFiles = () => {
    files.value = [];
    if (props.defaultUrl) {
      if (Array.isArray(props.defaultUrl)) {
        props.defaultUrl.forEach((u) => {
          files.value.push({ url: u, status: 'done' } as FileItem);
        });
      } else {
        files.value.push({ url: props.defaultUrl, status: 'done' } as FileItem);
      }
    }
  };
  watch(() => props.defaultUrl, initFiles);
  const onExceedLimit = () => {
    Message.error(`选择照片数量超过出现，仅允许上传${props.limit}张`);
  };

  const onChange = () => {
    const doneFileUrl = files.value.filter((t) => t.status === 'done').map((t) => t.url);
    if (props.limit === 1) {
      url.value = doneFileUrl[0] || '';
    } else {
      url.value = (doneFileUrl as string[]) || [];
    }
  };
  const customRequst = (option: RequestOption) => {
    const { fileItem } = option;
    const { controller, request } = uploadFileCanAbort(
      fileItem.file as File,
      props.data,
      props.action
    );
    request
      .then(({ data }) => {
        Message.success('上传成功');
        fileItem.url = data;
        fileItem.status = 'done';
        emits('success', data);
        onChange(); // 因为Arco的bug，导致在状态改变并不会触发onChange,这里手动触发
      })
      .catch(() => {
        Message.error('上传失败，请重新上传');
        fileItem.status = 'error';
      });

    return {
      abort() {
        controller.abort();
      },
    };
  };
</script>

<style lang="less" scoped>
  .upload-image-comp-container {
    :deep(.arco-upload-list-picture),
    :deep(.arco-upload-picture-card) {
      position: relative;
      width: v-bind('props.width');
      min-width: 10px;
      height: v-bind('props.height');
      overflow: hidden;
      border: 1px solid #ededed;
      border-radius: 6px;
    }
  }
</style>
