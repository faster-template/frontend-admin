<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="article-comp-preview-dialog">
    <a-modal
      v-model:visible="visible"
      :render-to-body="false"
      width="620px"
      body-class="article-preview-body"
      ok-text="关闭"
      hide-cancel
    >
      <template #title> {{ article.title }}</template>
      <a-spin :loading="loading">
        <div class="article-wrapper">
          <div class="auther-info">
            <span class="auther-info-name">{{ article.creator['nickName'] }}</span>
            <span class="auther-info-updatetime">{{ article.updateTime }}</span>
          </div>
          <div class="content" v-html="article.content"> </div>
          <like :relation-id="props.id" relation-type="article"></like>
          <comment :relation-id="props.id" relation-type="article"></comment> </div
      ></a-spin> </a-modal
  ></div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { getDetail } from '@/api/article';
  import useLoading from '@/hooks/loading';
  import { Message } from '@arco-design/web-vue';
  import DOMPurify from 'dompurify';
  import comment from '@/components/comment/index.vue';
  import like from '@/components/like/index.vue';

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
  const article = ref({
    title: '',
    content: '',
    creator: {},
    comments: [],
    updateTime: '',
  });
  const { loading, setLoading } = useLoading();
  function getArticle() {
    setLoading(true);
    getDetail(props.id)
      .then(({ data }) => {
        if (data) {
          article.value = data;
          article.value.content = DOMPurify.sanitize(data.content);
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
    :deep(.arco-modal-header) {
      height: auto;
      min-height: 48px;
      padding: 12px;
      line-height: 24px;
      text-align: center;
    }

    :deep(.article-preview-body) {
      max-height: 500px;
    }

    .article-wrapper {
      .auther-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        span {
          color: #666;
          font-size: 12px;
        }
      }

      .content {
        :deep(img) {
          max-width: 100%;
        }
      }
    }

    :deep(.like-comp-container) {
      text-align: right;
    }
  }
</style>
