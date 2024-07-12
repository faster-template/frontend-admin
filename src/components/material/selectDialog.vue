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
          >刷新</a-button
        >
        <a-button type="primary" @click="onShowCreateDialog">添加新素材</a-button>
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <a-spin :loading="loading">
      <lazyImageWrapper class="material-list">
        <div
          v-for="item in list"
          :key="item.id"
          :class="['material-list-item', item.path == option.selection?.path ? 'is-active' : '']"
          @click="onSelect(item)"
        >
          <img
            v-if="item.type == 'image'"
            :data-src="item.path"
            @error="
              () => {
                item.path = '';
              }
            "
          />
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
          <div v-if="!item.path" class="error-message"> 加载失败 </div>
        </div>
      </lazyImageWrapper></a-spin
    >
  </a-modal>

  <createMaterialDialog
    v-model:visible="createDialogVisible"
    :keep-open="false"
    :show-success-message="false"
    :accept-type="[filter.type]"
    @success="onCreateSuccess"
  >
  </createMaterialDialog>
</template>

<script setup lang="ts">
  import { getList } from '@/api/material';
  import useLoading from '@/hooks/loading';
  import { reactive, ref, toRefs } from 'vue';
  import { MaterialListItem, materialTypeOption } from '@/types/material';
  import lazyImageWrapper from '@/components/lazy-image/wrapper.vue';
  import createMaterialDialog from './createDialog.vue';

  const visible = defineModel('visible', {
    type: Boolean,
    default: false,
  });

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
    if (item.path) option.selection = item;
  }

  const emits = defineEmits(['ok']);
  function onOk() {
    if (option.selection?.path) {
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

  const createDialogVisible = ref(false);
  const onShowCreateDialog = () => {
    createDialogVisible.value = true;
  };
  const onCreateSuccess = (path) => {
    emits('ok', path);
    visible.value = false;
  };
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
      overflow: hidden scroll;

      &-item {
        position: relative;
        display: inline-block;
        box-sizing: border-box;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;
        border: 2px solid transparent;

        img,
        video {
          display: block;
          width: 100px;
          height: 100px;
        }

        .item-file {
          width: 100px;
          height: 100px;
          padding: 10px 0;
          color: #666;
          font-size: 12px;
          line-height: 18px;
          text-align: center;
          border: 1px solid #ccc;
        }
      }

      &-item.is-active {
        border: 2px solid rgb(var(--arcoblue-6));
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
        font-size: 12px;
        line-height: 24px;
        background-color: rgb(0 0 0 / 50%);
      }
    }
  }
</style>
