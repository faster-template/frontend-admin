<template>
  <a-modal
    v-model:visible="visible"
    width="620px"
    :footer="false"
    class="material-create-dialog-comp-container"
  >
    <template #title> 创建素材 </template>
    <a-form ref="formRef" :model="form" @submit="handleSubmit">
      <a-form-item field="size" label="OSS">
        <a-radio-group v-model="form.ossType" type="radio">
          <a-radio v-for="item in ossTypeOption" :key="item.value" :value="item.value">{{
            item.label
          }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item field="size" label="文件">
        <a-upload
          ref="uploadRef"
          v-model:file-list="uploadFiles"
          :auto-upload="false"
          :show-cancel-button="false"
          :accept="accept"
          :limit="1"
          @change="onChange"
        >
          <template #upload-button>
            <a-space>
              <a-button> 选择文件 </a-button>
            </a-space>
          </template>
          <template #start-icon></template>
        </a-upload>
      </a-form-item>
      <a-form-item>
        <a-space>
          <a-button type="primary" html-type="submit" :disabled="!form.file">提交</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
  import { ref, reactive, computed } from 'vue';
  import {
    ossTypeOption,
    acceptImages,
    acceptAudios,
    acceptDocs,
    acceptVideos,
    acceptTypes,
  } from '@/types/material';
  import { uploadFile } from '@/api/upload';
  import { Message } from '@arco-design/web-vue';

  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  });

  const formRef = ref();
  const form = reactive({
    ossType: 'qiniu',
    file: null,
  });
  const onChange = (fileList) => {
    form.file = fileList && fileList.length ? fileList[0].file : null;
  };

  const uploadFiles = ref([]);
  const emits = defineEmits(['success']);

  const props = defineProps({
    keepOpen: {
      type: Boolean,
      default: false,
    },
    showSuccessMessage: {
      type: Boolean,
      default: true,
    },
    acceptType: {
      type: Array,
      required: true,
    },
  });
  // 'image' | 'video' | 'audio' | 'file' | 'other'
  const accept = computed(() => {
    const types: Record<string, string[]> = {
      image: acceptImages,
      video: acceptVideos,
      audio: acceptAudios,
      file: acceptDocs,
      other: acceptTypes,
    };
    const mimeTypes = props.acceptType.reduce((acc: Array<string>, value) => {
      const acceptArr = types[value as string];
      if (acceptArr) {
        acc.push(...acceptArr);
      }
      return acc;
    }, []);
    return Array.from(new Set(mimeTypes)).join(',');
  });
  const handleSubmit = () => {
    if (form.file && (form.file as File).size > 0) {
      const extData = { folder: 'material', oss: form.ossType };
      uploadFile(form.file, extData).then((res) => {
        if (props.showSuccessMessage) {
          Message.success('添加素材成功');
        }
        emits('success', res.data);
        form.file = null;
        uploadFiles.value = [];
        if (!props.keepOpen) {
          visible.value = false;
        }
      });
    }
  };
</script>
