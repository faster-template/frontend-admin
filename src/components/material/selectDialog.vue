<template>
  <a-modal
    v-model:visible="visible"
    class="material-select-dialog-comp-container"
    width="620px"
    @ok="onOk"
  >
    <template #title> 选择素材 </template>
    <a-space class="header-filter">
      <div class="filter-item">
        <a-select
          v-model="filter.type"
          :disabled="!!props.type"
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
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <a-spin :loading="loading">
      <div class="material-list">
        <div
          v-for="item in list"
          :key="item.id"
          :class="['material-list-item', item.id == option.selection?.id ? 'is-active' : '']"
          @click="onSelect(item)"
        >
          <img v-if="item.type == 'image'" :src="item.path" />
          <video v-else-if="item.type == 'video'" :src="item.path"></video>
          <audio v-else-if="item.type == 'audio'" :src="item.path"></audio>
          <div v-else class="item-file">
            <icon-drive-file />
            <div>文件类型</div>
            <div>不支持预览</div>
            <div>复制链接下载查看</div>
          </div>
          <div class="icon">
            <icon-file-image v-if="item.type == 'image'" style="color: rgb(var(--arcoblue-2))" />
            <icon-file-video v-if="item.type == 'video'" style="color: rgb(var(--orange-6))" />
            <icon-file-audio v-if="item.type == 'audio'" style="color: rgb(var(--orange-6))" />
            <icon-drive-file v-if="item.type == 'file'" style="color: rgb(var(--red-5))" />
          </div>
        </div> </div
    ></a-spin>
  </a-modal>
</template>

<script setup lang="ts">
  import { getList } from '@/api/material';
  import useLoading from '@/hooks/loading';
  import { reactive, toRefs } from 'vue';
  import { MaterialListItem, MaterialType } from '@/types/material';

  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  });

  const emits = defineEmits(['ok']);
  const props = defineProps({
    type: String,
    default: null,
  });
  const option = reactive({
    list: [] as MaterialListItem[],
    total: 0,
    selection: {} as MaterialListItem,
  });
  function onSelect(item) {
    option.selection = item;
  }
  function onOk() {
    if (option.selection?.id) {
      emits('ok', option.selection?.path);
    }
  }
  const { list } = toRefs(option);
  const pagination = reactive({
    size: 20,
    page: 1,
    order: 'DESC',
    orderBy: 'createTime',
  });

  const filter = reactive({
    type: props.type,
    ossType: 'qiniu',
  });
  const { loading, setLoading } = useLoading();
  function loadData() {
    setLoading(true);
    getList({ ...filter, ...pagination })
      .then(({ data }) => {
        if (pagination.page === 1) {
          option.list = [];
        }

        option.list = option.list.concat(data.items);
        option.total = data.total;
      })
      .finally(() => {
        setLoading(false);
      });
  }
  loadData();
</script>

<style lang="less" scoped>
  .material-select-dialog-comp-container {
    .header-filter {
      display: flex;
      .filter-item {
        display: flex;
        align-items: center;

        &-input,
        :deep(.filter-item-input) {
          width: 200px;
        }
      }
    }
    .material-list {
      height: 400px;
      overflow-x: hidden;
      overflow-y: scroll;
      &-item {
        position: relative;
        overflow: hidden;
        margin-bottom: 12px;
        display: inline-block;
        margin-right: 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
        border: 2px solid transparent;
        img,
        video {
          width: 100px;
          height: 100px;
          display: block;
        }
        .item-file {
          width: 100px;
          height: 100px;
          text-align: center;
          color: #666666;
          line-height: 18px;
          font-size: 12px;
          padding: 10px 0;
          border: 1px solid #cccccc;
        }
      }
      &-item.is-active {
        border: 2px solid rgb(var(--arcoblue-6));
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
    }
  }
</style>
