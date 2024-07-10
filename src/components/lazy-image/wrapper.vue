<template>
  <div ref="wrapRef" class="lazy-img-wrapper-comp">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { ref, onUpdated, onMounted } from 'vue';
  // 可视化监听
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const target = entry.target as HTMLImageElement;
        // 图片加载完成
        target.src = target.dataset.src as string;
        target.removeAttribute('data-src');
        observer.unobserve(target);
      }
    });
  });
  function onError(event: Event) {
    const target = event?.target as HTMLImageElement;
    target.src = import.meta.env.VITE_DEFAULT_IMAGE_SRC_ERROR;
    target.removeEventListener('error', onError, true);
  }
  const wrapRef = ref();
  const observeImages = () => {
    const imgs = wrapRef.value.querySelectorAll('img[data-src]');
    imgs.forEach((img: HTMLImageElement) => {
      img.addEventListener('error', onError, true);
      observer.observe(img);
    });
  };
  onMounted(observeImages);
  onUpdated(observeImages);
</script>
