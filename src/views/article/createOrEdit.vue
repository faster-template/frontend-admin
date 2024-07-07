<template>
  <div class="article-modify-container">
    <a-spin :loading="pageLoad.loading.value">
      <a-form ref="formRef" :model="form" layout="vertical" :rules="rules" @submit="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="isEdit ? 6 : 8">
            <a-form-item field="title" label="标题">
              <a-input
                v-model="form.title"
                placeholder="请输入标题"
                max-length="30"
                allow-clear
                show-word-limit
              />
            </a-form-item>
          </a-col>
          <a-col :span="isEdit ? 6 : 8">
            <a-form-item field="categoryId" label="分类">
              <categorySelector v-model="form.categoryId" parent-key="ARTICLE" />
            </a-form-item>
          </a-col>
          <a-col v-if="isEdit" :span="6">
            <a-form-item field="draft" label="草稿">
              <draftSelector
                resource-type="article"
                :resource-id="String(route.params.id)"
                @change="draftSelected"
              ></draftSelector>
            </a-form-item>
          </a-col>

          <a-col :span="6">
            <a-form-item field="draft" label="操作">
              <a-space>
                <a-button :loading="loading" @click="saveDraft">存为草稿</a-button>
                <a-button html-type="submit" type="primary" :loading="loading">保存并发布</a-button>
              </a-space>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item field="content" label="内容">
          <editor v-model:content="form.content"></editor>
        </a-form-item> </a-form
    ></a-spin>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import debounce from 'lodash/debounce';
  import { useRoute, useRouter } from 'vue-router';

  import categorySelector from '@/components/category/selector.vue';
  import draftSelector from '@/components/draft/selector.vue';
  import editor from '@/components/editor/index.vue';
  import { saveAsDraft, save, getDetail } from '@/api/article';
  import useLoading from '@/hooks/loading';

  const router = useRouter();
  const route = useRoute();

  const formRef = ref();
  const form = reactive({
    id: null,
    title: '',
    categoryId: '',
    content: '',
  });
  const rules = {
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' },
      {
        minLength: 5,
        maxLength: 30,
        message: '长度为5~30个字',
        trigger: 'blur',
      },
    ],
    categoryId: [{ required: true, message: '请选择文章分类', trigger: 'blur' }],
    content: [
      { required: true, message: '请输入文章内容', trigger: 'blur' },
      {
        minLength: 5,
        maxLength: 8000,
        message: '长度为5~8000个字',
        trigger: 'blur',
      },
    ],
  };
  const { loading, setLoading } = useLoading();
  const pageLoad = useLoading();

  const isEdit = computed(() => {
    return route.name === 'article-edit';
  });
  if (isEdit.value)
    if (route.params && route.params.id) {
      // 编辑文章
      // 获取文章详情
      pageLoad.setLoading(true);
      getDetail(route.params.id as string)
        .then(({ data }) => {
          if (data) {
            form.id = data.id;
            form.title = data.title;
            form.categoryId = data.category.id;
            form.content = data.content;
          } else {
            Message.error('文章不存在');
            router.replace('/article/list');
          }
        })
        .finally(() => {
          pageLoad.setLoading(false);
        });
    } else {
      router.replace('/article/list');
    }

  const saveDraftDebounce = debounce(() => {
    saveAsDraft(form)
      .then(({ data }) => {
        form.id = data.id;
        Message.success('保存成功');
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  const saveDraft = () => {
    formRef.value.validate().then((res) => {
      if (!res) {
        setLoading(true);
        saveDraftDebounce();
      } else {
        Message.error('请检查表单内容是否正确');
      }
    });
  };

  const publishDebounce = debounce(() => {
    save(form)
      .then(() => {
        Message.success('已发布');
        router.replace('/article/list');
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  const handleSubmit = () => {
    formRef.value.validate().then((res) => {
      if (!res) {
        setLoading(true);
        publishDebounce();
      } else {
        Message.error('请检查表单内容是否正确');
      }
    });
  };

  const draftSelected = (draft) => {
    form.content = draft.content;
    form.title = draft.title;
  };
</script>

<style lang="less" scoped>
  .article-modify-container {
    margin: 0 20px;
    padding: 20px;
    background-color: #fff;

    :deep(.form-btn) {
      justify-content: flex-end;
    }
  }
</style>
