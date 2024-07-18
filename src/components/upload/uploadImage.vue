<template>
  <div class="upload-image-comp-container">
    <a-upload
      :action="props.action"
      :file-list="uploadFile ? [uploadFile] : []"
      :show-file-list="false"
      accept=".jpg,.png"
      with-credentials
      :headers="headers"
      :data="props.data"
      @success="onSuccess"
      @error="onError"
    >
      <template #upload-button>
        <div
          :class="`arco-upload-list-item${
            uploadFile && uploadFile.status === 'error' ? ' arco-upload-list-item-error' : ''
          }`"
        >
          <div
            v-if="uploadFile && uploadFile.url"
            class="arco-upload-list-picture custom-upload-avatar"
          >
            <img :src="uploadFile.url" />
            <div class="arco-upload-list-picture-mask">
              <IconEdit />
            </div>
          </div>
          <div v-else class="arco-upload-picture-card">
            <div class="arco-upload-picture-card-text">
              <IconPlus />
              <div style="margin-top: 10px; font-weight: 600">{{ props.text || '上传' }}</div>
            </div>
          </div>
        </div>
      </template>
    </a-upload>
    <a-button v-if="url" type="text" @click="onPreview">预览</a-button>
    <a-image-preview v-model:visible="visible" :src="url" />
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { FileItem, Message } from '@arco-design/web-vue';
  import { getToken } from '@/utils/auth';

  const url = defineModel('url', { type: String, default: '' });
  const emits = defineEmits(['success']);
  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
    text: {
      type: String,
      default: '上传',
    },
    action: { type: String, default: '/api/upload/file' },
  });
  const uploadFile = ref({ url: url.value } as FileItem);
  const headers = { Authorization: `Bearer ${getToken()}` };

  const onSuccess = (fileItem) => {
    if (fileItem.response && fileItem.response.success) {
      const fileUrl = fileItem.response.data;
      Message.success('上传成功');
      url.value = fileUrl;
      uploadFile.value.url = fileUrl;
      emits('success', fileUrl);
    } else {
      Message.error('上传失败，请重新上传');
    }
  };
  const onError = () => {
    Message.error('上传失败，请重新上传');
  };

  const visible = ref(false);
  const onPreview = () => {
    visible.value = !visible.value;
  };
</script>
