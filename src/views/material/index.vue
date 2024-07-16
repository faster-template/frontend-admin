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
          :options="materialTypeOption"
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
          >筛选/刷新</a-button
        >
        <a-button type="primary" @click="onShowCreateDialog">添加新素材</a-button>
        <a-button type="primary" @click="onShowSelectionDialog">演示-打开选择器</a-button>
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <a-spin ref="materialWrapperRef" :loading="loading" class="material-wrapper" @scroll="loadMore">
      <a-row class="material-list" :gutter="20">
        <a-col v-for="colItem in colList" :key="colItem.id" :span="option.gridSpan">
          <div v-for="item in colItem.list" :key="item.id" class="material-list-item">
            <lazy-image
              v-if="item.type == 'image'"
              :src="item.path"
              @error="
                () => {
                  item.path = '';
                }
              "
            />
            <video
              v-else-if="item.type == 'video'"
              :ref="(el) => setRefMap(el, item as MaterialListItem)"
              :src="item.path"
            ></video>
            <audio
              v-else-if="item.type == 'audio'"
              :ref="(el) => setRefMap(el, item as MaterialListItem)"
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
            <div v-if="item.path" class="operator">
              <a-tooltip v-if="['image'].includes((item as MaterialListItem).type)" content="预览">
                <icon-eye @click="onPreview(item)"
              /></a-tooltip>
              <a-tooltip
                v-else-if="['video', 'audio'].includes((item as MaterialListItem).type)"
                :content="item.mediaStatus == 0 ? '播放' : '暂停'"
              >
                <icon-play-circle-fill v-if="item.mediaStatus == 0" @click="onPreview(item)" />
                <icon-pause-circle v-else-if="item.mediaStatus == 1" @click="onPause(item)" />
              </a-tooltip>
              <a-tooltip content="复制链接">
                <icon-copy @click="onCopy(item)" />
              </a-tooltip>
            </div>
            <div v-else class="error-message"> 图片加载失败 </div>
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
    <createMaterialDialog
      v-model:visible="createDialogVisible"
      :keep-open="true"
      :accept-type="['other']"
    >
    </createMaterialDialog>
  </div>
</template>

<script setup lang="ts">
  import { getList } from '@/api/material';
  import { Message } from '@arco-design/web-vue';
  import { onBeforeUnmount, onMounted, reactive, ref, toRefs } from 'vue';
  import useLoading from '@/hooks/loading';
  import { copy2clipboard } from '@/utils/copy2clipboard';
  import debounce from 'lodash/debounce';
  import materialSelector from '@/components/material/selectDialog.vue';
  import { MaterialListItem } from '@/types/material';
  import lazyImage from '@/components/lazy-image/index.vue';
  import createMaterialDialog from '@/components/material/createDialog.vue';
  import { materialTypeOption } from '@/constants/material';

  const slectionDialogVisible = ref(false);
  const onShowSelectionDialog = () => {
    slectionDialogVisible.value = true;
  };
  const createDialogVisible = ref(false);
  const onShowCreateDialog = () => {
    createDialogVisible.value = true;
  };
  interface ColList {
    id: string;
    list: Partial<MaterialListItem>[];
  }

  const option = reactive({
    colList: [] as ColList[],
    list: [] as Partial<MaterialListItem>[],
    total: 0,
    gridCol: 0,
    gridSpan: 0,
  });

  const { colList } = toRefs(option);

  const materialContainertRef = ref();
  function appendColList(listData: Partial<MaterialListItem>[]) {
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
    return getList({ ...filter, ...pagination })
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
    copy2clipboard(item.path);
  }
</script>

<style lang="less" scoped>
  .material-container {
    box-sizing: border-box;
    width: calc(100% - 40px);
    margin: 0 20px;
    padding: 10px;
    overflow: hidden;
    background-color: #fff;

    .header-filter {
      display: flex;

      .filter-item {
        display: flex;
        align-items: center;

        &-label {
          padding-right: 20px;
          padding-left: 12px;
          color: #666;
          text-align: right;
        }

        &-input,
        :deep(.filter-item-input) {
          width: 200px;
        }
      }
    }

    .material-wrapper {
      height: calc(100vh - 160px);
      overflow: hidden scroll;
    }

    .material-list {
      margin-top: 12px;

      &-item {
        position: relative;
        margin-bottom: 20px;
        overflow: hidden;

        img,
        video {
          display: block;
          width: 100%;
          height: auto;
          max-height: 200px;
        }

        .item-file {
          height: 120px;
          padding: 10px 0;
          color: #666;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          border: 1px solid #ccc;
        }

        .icon {
          position: absolute;
          bottom: 0;
          left: 0;
          z-index: 10;
          height: 24px;
          padding: 0 4px;
          color: rgb(var(--blue-5));
          font-size: 16px;
          line-height: 24px;
          background-color: rgb(0 0 0 / 50%);
          border-radius: 0 8px 8px 0;
        }

        .operator,
        .error-message {
          position: absolute;
          bottom: 0;
          left: 0;
          display: flex;
          align-items: center;
          justify-content: space-evenly;
          width: 100%;
          height: 24px;
          color: #fff;
          line-height: 24px;
          background-color: rgb(0 0 0 / 50%);
        }
      }
    }

    .empty-container {
      padding: 60px;
    }
  }
</style>
