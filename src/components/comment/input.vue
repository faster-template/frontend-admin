<template>
  <div class="comment-input-comp-container">
    <textarea v-model="content" class="comment-input-textarea" placeholder="说点什么吧"></textarea>
    <div :class="['comment-input-btn', content.length ? 'is-active' : '']" @click="handleSubmit"
      >提交</div
    >
  </div>
</template>

<script setup lang="ts">
  import { inject, reactive, toRefs, unref } from 'vue';
  import { createComments } from '@/api/comment';
  import { Message } from '@arco-design/web-vue';

  const props = defineProps({
    parentId: { type: String, default: '' },
  });

  const option = reactive({
    content: '',
  });
  const { content } = toRefs(option);
  const emits = defineEmits(['success']);

  const relationId = inject('relationId') as string;
  const relationType = inject('relationType') as string;

  const handleSubmit = () => {
    if (content.value.trim()) {
      createComments({
        relationId,
        relationType,
        parentId: props.parentId,
        content: unref(content),
      }).then(({ data }) => {
        option.content = '';
        Message.success('评论成功');
        emits('success', data);
      });
    }
  };
</script>

<style lang="less" scoped>
  .comment-input-comp-container {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 60px;
    border: 1px solid #f1f1f1;
    border-radius: 4px;

    .comment-input-textarea {
      flex: 1;
      height: 100%;
      padding: 4px;
      border: none;
      resize: none;
    }

    .comment-input-btn {
      display: flex;
      flex-shrink: 0;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 100%;
      color: #666;
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    .comment-input-btn.is-active {
      color: rgb(var(--arcoblue-4));
      cursor: pointer;
      pointer-events: all;
    }
  }
</style>
