<template>
  <div ref="materialContainertRef" class="material-container">
    <a-space class="header-filter">
      <div class="filter-item">
        <div class="filter-item-label">素材类型</div>
        <a-select
          v-model="filter.type"
          allow-clear
          class="filter-item-input"
          placeholder="选择素材类型"
          :options="MaterialType"
        >
        </a-select>
      </div>
      <a-space class="filter-item">
        <a-button
          type="primary"
          @click="
            () => {
              pagination.page = 1;
              loadData();
            }
          "
          >筛选</a-button
        >
        <a-button type="primary" @click="onShowSelectionDialog">演示-打开选择器</a-button>
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <a-spin ref="materialWrapperRef" :loading="loading" class="material-wrapper" @scroll="loadMore">
      <a-row class="material-list" :gutter="20">
        <a-col v-for="colItem in colList" :key="colItem.id" :span="option.gridSpan">
          <div v-for="item in colItem.list" :key="item.id" class="material-list-item">
            <img v-if="item.type == 'image'" :src="item.path"  />
            <video
              v-else-if="item.type == 'video'"
              :ref="(el) => setRefMap(el, item)"
              :src="item.path"
            ></video>
            <audio
              v-else-if="item.type == 'audio'"
              :ref="(el) => setRefMap(el, item)"
              :src="item.path"
            ></audio>
            <div v-else class="item-file">
              <icon-drive-file />
              <div>文件类型</div>
              <div>不支持预览</div>
              <div>复制链接下载查看</div>
            </div>
            <div class="icon">
              <icon-file-image v-if="item.type == 'image'" />
              <icon-file-video v-if="item.type == 'video'" />
              <icon-file-audio v-if="item.type == 'audio'" />
              <icon-drive-file v-if="item.type == 'file'" />
            </div>
            <div class="operator">
              <a-tooltip v-if="['image'].includes(item.type)" content="预览">
                <icon-eye @click="onPreview(item)"
              /></a-tooltip>
              <a-tooltip
                v-else-if="['video', 'audio'].includes(item.type)"
                :content="item.mediaStatus == 0 ? '播放' : '暂停'"
              >
                <icon-play-circle-fill v-if="item.mediaStatus == 0" @click="onPreview(item)" />
                <icon-pause-circle v-else-if="item.mediaStatus == 1" @click="onPause(item)" />
              </a-tooltip>
              <a-tooltip content="复制链接">
                <icon-copy @click="onCopy(item)" />
              </a-tooltip>
            </div>
          </div>
        </a-col>
      </a-row>
      <a-empty v-if="!loading && option.list.length == 0" class="empty-container" />
    </a-spin>
    <a-image-preview v-model:visible="previewImage.visible" :src="previewImage.src" />

    <materialSelector
      v-model:visible="slectionDialogVisible"
      type="image"
      @ok="
        (url) => {
          Message.success(url);
        }
      "
    ></materialSelector>
  </div>
</template>

<script setup lang="ts">
  import { getList } from '@/api/material';
  import { clipboard } from '@/utils';
  import { Message } from '@arco-design/web-vue';
  import { onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
  import useLoading from '@/hooks/loading';
  import { debounce } from 'lodash';
  import materialSelector from '@/components/material/selectDialog.vue';
  import { MaterialListItem, MaterialType } from '@/types/material';

  const slectionDialogVisible = ref(false);
  const onShowSelectionDialog = () => {
    slectionDialogVisible.value = true;
  };

  interface ColList {
    id: string;
    list: MaterialListItem[];
  }

  const option = reactive({
    colList: [] as ColList[],
    list: [] as MaterialListItem[],
    total: 0,
    gridCol: 0,
    gridSpan: 0,
  });

  const { colList } = toRefs(option);

  const materialContainertRef = ref();
  function appendColList(listData: MaterialListItem[]) {
    // 增加瀑布流追加偏移，防止每次加载数据都从第一列追加
    // 选择最少数据列开始追加
    const offset = option.colList.reduce(
      (acc, val, index) => {
        if (val.list.length < acc.count) {
          acc.index = index;
          acc.count = val.list.length;
        }
        return acc;
      },
      { index: 0, count: 100000 }
    );
    listData.forEach((item, index) => {
      const colIndex = (index + offset.index) % option.gridCol;
      option.colList[colIndex].list.push({ ...item, mediaStatus: 0 });
    });
  }
  function clearCol() {
    option.colList.forEach((item) => {
      item.list = [];
    });
  }

  const { loading, setLoading } = useLoading();
  const pagination = reactive({
    size: 10,
    page: 1,
    order: 'DESC',
    orderBy: 'createTime',
  });
  const filter = reactive({
    type: 'image',
    ossType: 'qiniu',
  });
  function loadData() {
    setLoading(true);
    getList({ ...filter, ...pagination })
      .then(({ data }) => {
        if (pagination.page === 1) {
          clearCol();
          option.list = [];
        }

        option.list = option.list.concat(data.items);
        option.total = data.total;
        appendColList(data.items);
      })
      .finally(() => {
        setLoading(false);
      });
  }
  function setCol() {
    const oneWidth = 150;
    option.gridCol = Math.floor(materialContainertRef.value.clientWidth / oneWidth);
    option.gridSpan = Math.floor(24 / option.gridCol);
    option.colList = [];
    for (let i = 0; i < option.gridCol; i += 1) {
      option.colList.push({ id: `col-list-${i}`, list: [] });
    }
    loadData();
  }
  // 滑动加载更多
  const materialWrapperRef = ref();
  const loadMore = debounce(() => {
    if (option.list.length >= option.total) return;
    const el = materialWrapperRef.value.$el || materialWrapperRef.value;
    if (el.scrollHeight - (el.scrollTop + el.clientHeight) < 200) {
      pagination.page += 1;
      loadData();
    }
  }, 200);
  onMounted(() => {
    setCol();
    // materialWrapperRef.value?.addEventListener('scroll', loadMore);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', loadMore);
  });

  const previewImage = reactive({
    src: '',
    visible: false,
  });
  // type refItem = Element | ComponentPublicInstance | null;
  const refMap: Record<string, any> = {};
  const setRefMap = (el: any, item: { id: string }) => {
    if (el) {
      refMap[`${item.id}`] = el;
    }
  };
  function onImageError(event){
    console.log(event)
  }
  function onPreview(item) {
    switch (item.type) {
      case 'image':
        previewImage.src = item.path;
        previewImage.visible = true;
        break;
      case 'video':
      case 'audio':
        refMap[item.id]?.play();
        item.mediaStatus = 1;
        break;
      default:
        Message.info('该文件无法提供预览');
        break;
    }
  }
  function onPause(item) {
    refMap[item.id]?.pause();
    item.mediaStatus = 0;
  }
  function onCopy(item) {
    clipboard(item.path);
  }
</script>

<style lang="less" scoped>
  .material-container {
    margin: 0 20px;
    padding: 10px;
    background-color: #ffffff;
    width: calc(100% - 40px);
    overflow: hidden;
    box-sizing: border-box;
    .header-filter {
      display: flex;
      .filter-item {
        display: flex;
        align-items: center;

        &-label {
          padding-left: 12px;
          text-align: right;
          padding-right: 20px;
          color: #666666;
        }

        &-input,
        :deep(.filter-item-input) {
          width: 200px;
        }
      }
    }
    .material-wrapper {
      height: calc(100vh - 160px);
      overflow-x: hidden;
      overflow-y: scroll;
    }
    .material-list {
      margin-top: 12px;
      &-item {
        position: relative;
        overflow: hidden;
        margin-bottom: 20px;
        img,
        video {
          width: 100%;
          height: auto;
          display: block;
        }
        .item-file {
          height: 120px;
          text-align: center;
          color: #666666;
          line-height: 18px;
          font-size: 12px;
          padding: 10px 0;
          border: 1px solid #cccccc;
        }
        .icon {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 24px;
          line-height: 24px;
          padding: 0 4px 0 4px;
          font-size: 16px;
          background-color: rgba(0, 0, 0, 0.5);
          color: rgb(var(--blue-5));
          z-index: 10;
          border-radius: 0 8px 8px 0;
        }
        .operator {
          position: absolute;
          bottom: 0;
          left: 0;
          display: flex;
          background-color: rgba(0, 0, 0, 0.5);
          width: 100%;
          color: #ffffff;
          height: 24px;
          line-height: 24px;
          align-items: center;
          justify-content: space-evenly;
        }
      }
    }
    .empty-container {
      padding: 60px;
    }
  }
</style>
