<template>
  <div class="category-create-dialog-container">
    <a-modal
      v-model:visible="visible"
      :mask-closable="false"
      :closable="false"
      :ok-loading="option.okLoading"
      @before-ok="submitForm"
    >
      <template #title> {{ isEdit ? '编辑分类' : '创建分类' }} </template>
      <a-form ref="formRef" :model="form" :rules="rules">
        <a-form-item v-if="props.parentNode" field="description" label="父节点">
          {{ props.parentNode && props.parentNode.name }}
        </a-form-item>
        <a-form-item field="name" label="名称">
          <a-input v-model="form.name" placeholder="请输入名称" />
        </a-form-item>
        <a-form-item field="key" label="标识">
          <a-input v-model="form.key" placeholder="唯一标识，全大写，2~20字" />
        </a-form-item>
        <a-form-item field="icon" label="Icon">
          <uploadImage
            v-model:url="form.icon"
            :default-url="form.icon"
            :data="{ folder: 'icon', oss: 'qiniu' }"
          ></uploadImage>
        </a-form-item>
        <a-form-item field="url" label="链接">
          <a-input v-model="form.url" placeholder="此处允许录入链接便于前端操作" />
        </a-form-item>
        <a-form-item field="description" label="描述">
          <a-textarea v-model="form.description" placeholder="请输入描述" />
        </a-form-item>
        <!-- <a-form-item field="sort" label="排序序号">
          <a-input-number v-model="form.sort" placeholder="请输入排序序号" :min="1" :max="100" />
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue';
  import { create, update } from '@/api/category';
  import uploadImage from '@/components/upload/uploadImage.vue';
  import { ICategory } from '../types';

  // ref
  const formRef = ref();
  // Props & Model
  const visible = defineModel('visible', { type: Boolean, default: false });
  const categoryModel = defineModel('categoryModel', { type: Object, default: false });
  const props = defineProps({
    parentNode: {
      type: Object as () => ICategory | null,
      default: null,
    },
  });
  // Emits
  const emits = defineEmits(['success']);
  const option = reactive({
    okLoading: false,
  });
  const form = reactive({
    name: '',
    key: '',
    icon: '',
    url: '',
    description: '',
    parentId: '' as null | string,
    id: '' as null | string,
    sort: 1,
  });
  const rules = {
    name: [
      {
        required: true,
        message: '请输入名称',
      },
      {
        maxLength: 20,
        minLength: 2,
        message: '标识长度2-20个字符',
      },
    ],
    key: [
      {
        required: true,
        message: '请输入标识',
      },
      {
        maxLength: 20,
        minLength: 2,
        message: '标识长度2-20个字符',
      },
      {
        match: /^[A-Z]+$/,
        message: '标识只能包含大写字母',
      },
    ],
  };
  const isEdit = computed(() => {
    return categoryModel.value && categoryModel.value.id;
  });
  const createCategory = (done) => {
    form.parentId = null;
    if (props.parentNode) {
      form.parentId = props.parentNode.id;
    }
    return create(form).then(() => {
      done();
      emits('success');
    });
  };
  const updateCategory = (done) => {
    return update(form).then(() => {
      done();
      emits('success');
    });
  };
  const submitForm = (done) => {
    const func = isEdit.value ? updateCategory : createCategory;
    formRef.value
      .validate()
      .then((res) => {
        if (res) {
          done(false);
        } else {
          func(done).catch(() => {
            done(false);
          });
        }
      })
      .catch(() => {
        done(false);
      });
  };

  watch(visible, (val) => {
    if (val) {
      form.id = null;
      formRef.value.resetFields();
      if (categoryModel.value) {
        form.name = categoryModel.value.name;
        form.key = categoryModel.value.key;
        form.description = categoryModel.value.description;
        form.sort = categoryModel.value.sort;
        form.parentId = categoryModel.value.parentId;
        form.url = categoryModel.value.url;
        form.icon = categoryModel.value.icon;
        form.id = categoryModel.value.id;
      }
    }
  });
</script>
