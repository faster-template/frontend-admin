<template>
  <a-modal v-model:visible="visible" class="article-comp-preview-dialog" width="620px" >
    <template #title> {{ article.title }}</template>
    <a-spin :loading="loading">
      <div class="article-wrapper">
        <div class="content" v-html="article.content"> </div>
        <commentList :relation-id="props.id" relation-type="article"></commentList> </div
    ></a-spin>
  </a-modal>
</template>

<script setup lang="ts">
  import { reactive } from 'vue';
  import { getDetail } from '@/api/article';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import DOMPurify from 'dompurify';
  import commentList from './commentList.vue';

  const props = defineProps({
    id: { type: String, default: null },
  });
  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  });
  if (!props.id) {
    visible.value = false;
  }
  const article = reactive({
    title: '',
    content: '',
    comments: [],
  });
  const { loading, setLoading } = useLoading();
  function getArticle() {
    setLoading(true);
    getDetail(props.id)
      .then(({ data }) => {
        if (data) {
          article.title = data.title;
          article.content = DOMPurify.sanitize(data.content);
        } else {
          Message.error('文章不存在');
          visible.value = false;
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }
  getArticle();
</script>

<style lang="less" scoped>
  .article-comp-preview-dialog {
  }
</style>
