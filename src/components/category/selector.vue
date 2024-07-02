<template>
  <a-tree-select
    v-model="selection"
    :class="['category-selector-comp-container', props.className]"
    :field-names="{
      key: 'id',
      title: 'name',
      children: 'children',
    }"
    :allow-search="true"
    :allow-clear="true"
    :data="treeData"
    placeholder="请选择分类"
  ></a-tree-select>
</template>

<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { getChildrenByKey } from '@/api/category';

  const props = defineProps({
    parentKey: {
      type: String,
      default: null,
    },
    className: {
      type: String,
      default: '',
    },
  });
  const selection = defineModel('selection', { type: String, default: null });
  const option = reactive({ treeData: [] });
  const { treeData } = toRefs(option);

  getChildrenByKey(props.parentKey).then(({ data }) => {
    option.treeData = data;
  });
</script>
