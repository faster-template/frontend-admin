<template>
  <img ref="imgRef" :src="originSrc" style="width: 100%; height: auto" @error="onError" />
</template>

<script setup lang="ts">
  import { onMounted, ref, reactive, toRefs } from 'vue';

  const option = reactive({
    originSrc: import.meta.env.VITE_DEFAULT_IMAGE_SRC,
  });
  const { originSrc } = toRefs(option);

  const props = defineProps({
    src: {
      type: String,
    },
  });

  // 可视化监听
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // 图片加载完成
        option.originSrc = props.src;
        observer.unobserve(entry.target);
      }
    });
  });

  const imgRef = ref();
  onMounted(() => {
    observer.observe(imgRef.value);
  });
  const emits = defineEmits(['error']);
  function onError(event: Event) {
    const target = event?.target as HTMLImageElement;
    // 图片加载失败
    target.src = import.meta.env.VITE_DEFAULT_IMAGE_SRC_ERROR;
    target.onerror = null;
    emits('error', event);
  }
</script>
