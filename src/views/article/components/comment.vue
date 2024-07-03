<template>
  <div class="article-comp-comment-container">
    <div class="comment-user-avatar">
      <img :src="props.data.creator?.avatarUrl" />
    </div>
    <div class="comment-info">
      <div class="comment-info-user"
        ><span class="comment-info-user-name">{{ props.data.creator?.nickName }}</span
        ><span class="comment-info-user-time">{{
          dayjs(props.data.createTime).format('YYYY-MM-DD HH:mm:ss')
        }}</span>
      </div>
      <div class="comment-info-content"
        ><div v-html="DOMPurify.sanitize(props.data.content)"></div
      ></div>
      <div v-if="props.data.children && props.data.children.length">
        <comment v-for="child in props.data.children" :key="child.id" :data="child"></comment>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CommentDetail } from '@/types/comment';
  import DOMPurify from 'dompurify';

  import * as dayjs from 'dayjs';

  const props = defineProps({
    data: {
      type: Object as () => CommentDetail,
      default: () => {
        return {};
      },
    },
  });
</script>

<style lang="less" scoped>
  .article-comp-comment-container {
    border: 1px solid #eeeeee;
    padding: 8px 10px;
    border-radius: 8px;
    background-color: #fafafa;
    margin-bottom: 10px;
    display: flex;
    .comment-user-avatar {
      img {
        height: 32px;
        width: 32px;
        border-radius: 50%;
      }
    }
    .comment-info {
      margin-left: 12px;
      &-user {
        color: #666666;
        line-height: 20px;
        &-time {
          margin-left: 12px;
          font-size: 12px;
        }
      }
      &-content {
        margin: 6px 0 6px 10px;
        line-height: 24px;
      }
    }
  }
</style>
