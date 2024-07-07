<template>
  <div class="category-comp-root-list-container">
    <div class="header-tools">
      <div>分类</div>
      <a-space>
        <a-button type="outline" size="mini" @click="handlerAdd">新增</a-button>
        <a-button type="outline" size="mini" @click="loadData">刷新</a-button></a-space
      >
    </div>
    <a-spin :loading="loading">
      <VueDraggable
        ref="el"
        v-model="rootList"
        class="drag-list"
        :animation="300"
        :delay="0"
        handle=".drag-handle"
        @end="onDrag"
      >
        <div
          v-for="item in rootList"
          :key="item.id"
          :class="['drag-list-item', item.id == selection?.id ? 'is-active' : '']"
        >
          <div class="drag-handle"><icon-drag-dot-vertical /></div>
          <div class="drag-list-item-label" @click="selectRoot(item)"
            ><div class="drag-list-item-label-name"> {{ item.name }}</div
            ><div class="drag-list-item-label-key"> Key: {{ item.key }} </div></div
          >
          <a-space class="drag-list-item-btns">
            <a-tooltip content="复制Key值" position="top" mini>
              <icon-copy @click="copy2clipboard(item.key)"
            /></a-tooltip>
            <icon-edit @click="handlerEdit(item)" />
            <a-popconfirm
              content="确认要删除该分类么？"
              type="warning"
              :on-before-ok="
                (done) => {
                  handlerDel(item.id, done);
                }
              "
            >
              <icon-delete /> </a-popconfirm
          ></a-space>
        </div> </VueDraggable
    ></a-spin>

    <modifyDialog
      v-model:visible="dialogOption.visible"
      v-model:categoryModel="dialogOption.model"
      :parent-node="null"
      @success="onSuccess"
    ></modifyDialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { VueDraggable } from 'vue-draggable-plus';
  import useLoading from '@/hooks/loading';
  import { getRootList, del, sort } from '@/api/category';
  import { copy2clipboard, debounce } from '@/utils';
  import { ICategory } from '../types';
  import modifyDialog from './createOrEditDialog.vue';

  const option = reactive({
    rootList: [] as ICategory[],
    rootListSource: [] as ICategory[],
    selection: null as ICategory | null,
  });
  const dialogOption = reactive({
    visible: false,
    model: null as ICategory | null,
  });
  const { rootList, selection, rootListSource } = toRefs(option);
  const { loading, setLoading } = useLoading();

  const emits = defineEmits(['change']);
  // 加载根节点
  const loadDataDebounce = debounce(() => {
    getRootList()
      .then(({ data }) => {
        option.rootList = data;
        option.rootListSource = [...data];
      })
      .finally(() => {
        setLoading(false);
      });
  }, 200);

  const loadData = () => {
    setLoading(true);
    loadDataDebounce();
  };
  loadData();

  const selectRoot = (item) => {
    option.selection = item;
    emits('change', item);
  };
  const handlerAdd = () => {
    dialogOption.model = null;
    dialogOption.visible = true;
  };

  const handlerEdit = (item) => {
    dialogOption.model = item;
    dialogOption.visible = true;
  };

  const handlerDel = (id, done) => {
    del(id)
      .then(() => {
        loadData();
        if (option.selection?.id === id) {
          option.selection = null;
          emits('change', null);
        }
      })
      .finally(() => {
        done();
      });
  };

  const onSuccess = () => {
    loadData();
  };

  const onDrag = (data) => {
    const { oldIndex, newIndex } = data;
    if (oldIndex !== newIndex) {
      const source = rootListSource.value[oldIndex];
      const target = rootListSource.value[newIndex];
      sort(source.id, target.id, oldIndex > newIndex ? -1 : 1).then(() => {
        loadData();
      });
    }
  };
</script>

<style lang="less" scoped>
  .category-comp-root-list-container {
    background-color: #ffffff;
    min-height: 500px;
    .header-tools {
      padding: 12px 20px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
      line-height: 1.5;
      border-bottom: 1px solid var(--color-neutral-3);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .drag-list {
      &-item {
        padding: 8px 20px 8px 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        .drag-handle {
          cursor: move;
          flex: 0;
          color: #999999;
        }
        &-label {
          flex: 1;
          margin-left: 10px;
          font-size: 14px;
          &-name {
            color: #333333;
            line-height: 20px;
          }
          &-key {
            font-size: 12px;
            line-height: 24px;
            color: #666666;
          }
        }
        &-btns {
          flex: 0;
          width: 50px;
          display: flex;
        }
        &::after {
          content: '';
          display: block;
          clear: both;
          height: 1px;
          width: 100%;
          background-color: var(--color-neutral-3);
          position: absolute;
          bottom: 0;
          left: 0;
          transform: scaleY(0.5);
        }
      }
      &-item.is-active {
        background-color: #efefef;
      }
    }
  }
</style>
