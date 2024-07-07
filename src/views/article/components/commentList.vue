<template>
  <div class="article-comp-comment-list-container">
    <a-divider>
      评论区 <span class="divider-sub-title">共{{ commentData.total }}个评论</span></a-divider
    >
    <div class="like-wrapper">
      <like :relation-id="props.relationId" :relation-type="props.relationType"></like>
    </div>
    <div class="comment-textarea">
      <a-textarea v-model="content" placeholder="Please enter something" allow-clear />
      <a-button type="primary" :loading="loading" :disabled="!content.length" @click="handleSubmit"
        >提交</a-button
      >
    </div>
    <div class="comment-wrapper">
      <comment v-for="item in commentData.items" :key="item.id" :data="item"></comment>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, toRefs, unref } from 'vue';
  import { getComments, createComments } from '@/api/comment';
  import { CommentDetail } from '@/types/comment';
  import useLoading from '@/hooks/loading';
  import comment from './comment.vue';
  import like from './like.vue';

  const props = defineProps({
    relationId: {
      type: String,
      default: null,
    },
    relationType: {
      type: String,
      default: null,
    },
  });
  const option = reactive({
    content: '',
    commentData: {
      total: 0,
      items: [] as CommentDetail[],
    },
  });

  const { commentData, content } = toRefs(option);
  getComments({ relationId: props.relationId, relationType: 'article' }).then((res) => {
    commentData.value = res.data;
  });

  const { loading, setLoading } = useLoading();
  const handleSubmit = () => {
    if (content.value.trim()) {
      const { relationId, relationType } = props;
      createComments({
        relationId,
        relationType,
        content: unref(content),
      })
        .then(() => {
          option.content = '';
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
</script>

<style lang="less" scoped>
  .article-comp-comment-list-container {
    .divider-sub-title {
      color: #666;
      font-size: 12px;
    }

    .like-wrapper {
      margin-bottom: 10px;
      text-align: right;
    }

    .comment-wrapper {
      max-height: 300px;
      overflow-y: scroll;
    }
  }
</style>
