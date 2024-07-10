<!-- eslint-disable vue/no-v-html -->
<template>
  <div class="comment-single-comp-container">
    <div :class="['comment-detail', commentData.state === -1 ? 'is-delete' : '']">
      <div class="comment-user-avatar">
        <img :src="commentData.creator?.avatarUrl" />
      </div>
      <div class="comment-info">
        <div class="comment-info-user"
          ><span class="comment-info-user-name">{{ commentData.creator?.nickName }}</span
          ><span class="comment-info-user-time">{{ commentData.createTime }}</span>
        </div>
        <div class="comment-info-content"
          ><div v-html="DOMPurify.sanitize(commentData.content)"></div
        ></div>
        <div v-if="commentData.state !== -1" class="comment-info-btns">
          <a-space>
            <a-link type="text" @click="onReply">回复</a-link>
            <a-link type="text" @click="onDelete">删除</a-link>
          </a-space>
        </div>
        <commentInput
          v-if="inputVisible"
          :parent-id="commentData.id"
          @success="onSuccess"
        ></commentInput>
      </div>
    </div>
    <div v-if="commentData.children && commentData.children.length" class="comment-children">
      <single
        v-for="child in commentData.children"
        :key="child.id"
        :data="child"
        @delete="onDeleteChild"
      ></single>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { CommentDetail } from '@/types/comment';
  import DOMPurify from 'dompurify';
  import { reactive, ref } from 'vue';
  import useUserStore from '@/store/modules/user';
  import { UserInfo } from '@/types/user';
  import { Message } from '@arco-design/web-vue';
  import { deleteComments } from '@/api/comment';
  import commentInput from './input.vue';

  const props = defineProps({
    data: {
      type: Object as () => CommentDetail,
      default: () => {
        return {};
      },
    },
  });

  const commentData = reactive({ ...props.data });

  const inputVisible = ref(false);
  const userStore = useUserStore();
  const onSuccess = ({ id, content, createTime }) => {
    commentData.children.unshift({
      id,
      createTime,
      content,
      creator: userStore.userInfo as UserInfo,
      children: [],
      state: 1,
    });
    inputVisible.value = false;
  };
  const onReply = () => {
    inputVisible.value = true;
  };
  const emits = defineEmits(['delete']);
  const onDelete = () => {
    deleteComments(commentData.id).then(({ data }) => {
      Message.success('删除成功');
      // 软删除
      if (data) {
        commentData.content = data.content;
        commentData.state = -1;
      } else {
        emits('delete', commentData);
      }
    });
  };

  const onDeleteChild = (data) => {
    commentData.children = commentData.children.filter((item) => item.id !== data.id);
  };
</script>

<style lang="less" scoped>
  .comment-single-comp-container {
    margin-top: 10px;
    padding: 8px 10px;
    background-color: #fafafa;
    border: 1px solid #eee;
    border-radius: 8px;

    .comment-detail {
      display: flex;

      .comment-user-avatar {
        img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
        }
      }

      .comment-info {
        flex: 1;
        margin-left: 12px;

        &-user {
          color: #666;
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

        &-btns {
          display: flex;
          justify-content: flex-end;
          height: 12px;
          line-height: 12px;
          text-align: right;

          :deep(a) {
            font-size: 12px;
          }
        }

        :deep(.comment-input-comp-container) {
          margin-top: 10px;
        }
      }
    }

    .comment-detail.is-delete {
      .comment-info {
        &-content {
          color: #999;
          text-decoration: line-through;
        }
      }
    }
  }
</style>
