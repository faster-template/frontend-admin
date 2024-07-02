<template>
  <Breadcrumb v-if="props.hasBreadCrumb" class="layout-bread-crumb"></Breadcrumb>
  <router-view v-slot="{ Component, route }">
    <transition name="fade" mode="out-in" appear>
      <component :is="Component" v-if="route.meta.ignoreCache" :key="route.fullPath" />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition> </router-view
></template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { useTabBarStore } from '@/store';
  import Breadcrumb from '@/components/breadcrumb/index.vue';

  const props = defineProps({
    hasBreadCrumb: {
      default: true,
      type: Boolean,
    },
  });
  const tabBarStore = useTabBarStore();
  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less">
  .layout-bread-crumb {
    margin: 6px 20px;
  }
</style>
