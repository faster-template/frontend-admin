<template>
  <div class="article-comp-comment-list-container">
    <a-divider>
      评论区 <span class="divider-sub-title">共{{ commentData.total }}个评论</span></a-divider
    >
    <commentInput @success="onCommentSuccess"></commentInput>
    <div class="comment-wrapper">
      <commentSingle
        v-for="item in commentData.items"
        :key="item.id"
        :data="item"
        :relation-id
        @delete="onCommentDelete"
      ></commentSingle>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { provide, reactive, toRefs } from 'vue';
  import { getComments } from '@/api/comment';
  import { CommentDetail } from '@/types/comment';
  import { useUserStore } from '@/store';

  import { UserInfo } from '@/types/user';
  import commentSingle from './single.vue';
  import commentInput from './input.vue';

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
  provide('relationId', props.relationId);
  provide('relationType', props.relationType);

  const option = reactive({
    content: '',
    commentData: {
      total: 0,
      items: [] as CommentDetail[],
    },
  });

  const { commentData } = toRefs(option);
  getComments({ relationId: props.relationId, relationType: 'article' }).then((res) => {
    option.commentData = res.data;
  });

  const userStore = useUserStore();
  const onCommentSuccess = ({ id, content, createTime }) => {
    option.commentData.total += 1;
    option.commentData.items.unshift({
      id,
      createTime,
      content,
      creator: userStore.userInfo as UserInfo,
      children: [],
    });
  };

  const onCommentDelete = (data) => {
    option.commentData.items = option.commentData.items.filter((item) => item.id !== data.id);
  };
</script>

<style lang="less" scoped>
  .article-comp-comment-list-container {
    .divider-sub-title {
      color: #666;
      font-size: 12px;
    }

    .comment-wrapper {
      max-height: 300px;
      margin-top: 12px;
      overflow-y: scroll;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
</style>
