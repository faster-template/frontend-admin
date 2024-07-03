<template>
  <div class="article-comp-comment-list-container">
    <a-divider>
      评论区 <span class="divider-sub-title">共{{ commentData.total }}个评论</span></a-divider
    >
    <div class="like-wrapper">
      <like :relation-id="props.relationId" :relation-type="props.relationType"></like>
    </div>
    <div class="comment-wrapper">
      <comment v-for="item in commentData.items" :key="item.id" :data="item"></comment>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { getComments } from '@/api/comment';
  import { CommentDetail } from '@/types/comment';
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
  const commentData = ref({
    total: 0,
    items: [] as CommentDetail[],
  });

  getComments({ relationId: props.relationId, relationType: 'article' }).then((res) => {
    commentData.value = res.data;
  });
</script>

<style lang="less" scoped>
  .article-comp-comment-list-container {
    .divider-sub-title {
      font-size: 12px;
      color: #666666;
    }
    .like-wrapper {
      text-align: right;
      margin-bottom: 10px;
    }
    .comment-wrapper {
      height: 300px;
      overflow-y: scroll;
    }
  }
</style>
