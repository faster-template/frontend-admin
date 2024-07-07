<template>
  <a-select
    v-model="selection"
    :class="['draf-selector-comp-container', props.className]"
    placeholder="选择草稿填充"
    @change="
      (item) => {
        selectDraft(item);
      }
    "
  >
    <template #prefix>
      <icon-refresh @click="load" />
    </template>
    <a-option
      v-for="item in listData"
      :key="item['id']"
      :value="item['contentJson']"
      :label="item['createTime']"
    ></a-option>
  </a-select>
</template>

<script setup lang="ts">
  import { getList } from '@/api/draf';
  import { reactive, toRefs } from 'vue';
  import { useDebounceFn } from '@vueuse/core';

  const props = defineProps({
    resourceId: {
      type: String,
      default: null,
    },
    resourceType: {
      type: String,
      default: null,
    },
    className: {
      type: String,
      default: '',
    },
  });

  const option = reactive({ listData: [], selection: undefined });
  const { listData, selection } = toRefs(option);

  const emits = defineEmits(['change']);

  const selectDraft = (contentJson) => {
    emits('change', JSON.parse(contentJson));
  };
  const load = useDebounceFn(() => {
    getList({ resourceId: props.resourceId, resourceType: props.resourceType }).then(({ data }) => {
      option.listData = data;
    });
  }, 500);
  load();
</script>
