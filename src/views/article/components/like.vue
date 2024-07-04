<template>
  <div class="article-comp-like-container">
    <a-button-group type="outline" size="mini">
      <a-button @click="onLike">
        <template #icon
          ><icon-thumb-up-fill v-if="likeData.myLikeType == 'like'" /> <icon-thumb-up v-else
        /></template>
        {{ likeData.likeCount || '' }}
      </a-button>

      <a-button @click="onDisLike">
        <template #icon
          ><icon-thumb-down-fill v-if="likeData.myLikeType == 'dislike'" />
          <icon-thumb-down v-else />
        </template>
        {{ likeData.dislikeCount || '' }}
      </a-button>
    </a-button-group>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { LikeResult } from '@/types/like';
  import { likeAdd, likeGetCount, likeDelete } from '@/api/like';

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

  const likeData = ref({} as LikeResult);

  const { relationId, relationType } = props;
  likeGetCount({ relationId, relationType }).then(({ data }) => {
    likeData.value = data;
  });

  function likeCreate(likeType: string) {
    // 点赞
    likeAdd({ relationId, relationType, likeType: 'like' }).then(() => {
      likeData.value.myLikeType = likeType;
      likeData.value[`${likeType}Count`] += 1;
    });
  }
  function likeDel(likeType: string) {
    // 点赞
    likeDelete({ relationId, relationType }).then(() => {
      likeData.value.myLikeType = '';
      likeData.value[`${likeType}Count`] -= 1;
    });
  }

  function onLike() {
    if (likeData.value.myLikeType === 'like') {
      // 取消点赞
      likeDel('like');
    } else {
      if (likeData.value.myLikeType === 'dislike') {
        likeData.value.dislikeCount -= 1;
      }
      likeCreate('like');
    }
  }

  function onDisLike() {
    if (likeData.value.myLikeType === 'dislike') {
      // 取消点踩
      likeDel('dislike');
    } else {
      if (likeData.value.myLikeType === 'like') {
        likeData.value.likeCount -= 1;
      }
      likeCreate('dislike');
    }
  }
</script>
