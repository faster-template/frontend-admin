<template>
  <div class="category-comp-children-tree-container">
    <a-spin :loading="loading">
      <div class="header-tools"
        >子分类
        <a-space>
          <a-button
            :disabled="!props.root"
            type="primary"
            size="mini"
            @click="
              () => {
                onAdd(null);
              }
            "
            >新增</a-button
          ><a-button
            :disabled="!props.root"
            type="primary"
            size="mini"
            @click="
              () => {
                loadData();
              }
            "
            >刷新</a-button
          >
        </a-space></div
      >

      <a-tree
        v-if="treeData && treeData.length"
        ref="treeRef"
        :data="treeData"
        :show-line="true"
        :default-expand-all="true"
        block-node
        @drop="onDrop"
      >
        <template #title="nodeData"
          ><div
            ><div class="text-title"> {{ nodeData.title }}</div>
            <div class="text-key">Key: {{ formatNodeKey(nodeData.key).key }} </div></div
          ></template
        >
        <template #extra="nodeData">
          <a-space class="tree-item-btns">
            <a-tooltip content="复制Key值" position="top" mini>
              <icon-copy @click="copy2clipboard(formatNodeKey(nodeData.key).key)"
            /></a-tooltip>
            <icon-edit @click="onEdit(formatNodeKey(nodeData.key).id)" />
            <a-popconfirm
              content="确认要删除该分类么？"
              type="warning"
              :on-before-ok="
                (done) => {
                  onDel(formatNodeKey(nodeData.key).id, done);
                }
              "
            >
              <icon-delete />
            </a-popconfirm>

            <IconPlus
              @click="() => onAdd({ name: nodeData.title, id: formatNodeKey(nodeData.key).id })"
            />
          </a-space>
        </template>
      </a-tree>

      <a-empty v-else />
    </a-spin>
    <modifyDialog
      v-model:visible="dialogOption.visible"
      v-model:categoryModel="dialogOption.model"
      :parent-node="dialogOption.parent"
      @success="onSuccess"
    ></modifyDialog>
  </div>
</template>

<script setup lang="ts">
  import { watch, reactive, ref, nextTick, toRefs } from 'vue';
  import { Message, TreeNodeData } from '@arco-design/web-vue';

  import useLoading from '@/hooks/loading';
  import { getChildren, del, sort } from '@/api/category';
  import { copy2clipboard } from '@/utils/copy2clipboard';
  import debounce from 'lodash/debounce';
  import { ICategory } from '../types';
  import modifyDialog from './createOrEditDialog.vue';

  const props = defineProps({
    root: {
      type: Object as () => ICategory | null,
      default: null,
    },
  });
  const option = reactive({
    treeData: [],
    treeDataSource: [],
  });
  const { treeData, treeDataSource } = toRefs(option);

  const dialogOption = reactive({
    visible: false,
    model: null as ICategory | null,
    parent: null as ICategory | null,
  });
  const { loading, setLoading } = useLoading();
  const treeRef = ref();

  const format2TreeData = (node: ICategory): TreeNodeData => {
    return {
      key: `${node.id}@${node.key}`,
      title: node.name,
      children: node.children?.map(format2TreeData),
      isLeaf: node.children?.length === 0,
      draggable: true,
    };
  };
  const formatNodeKey = (nodeKey) => {
    const [id, key] = nodeKey.split('@');
    return { id, key };
  };
  const loadDataDebounce = debounce(() => {
    getChildren(props.root?.id as string)
      .then(({ data }) => {
        // 将data 转换成TreeData
        option.treeData = [];
        option.treeDataSource = [];
        if (data && data.length) {
          option.treeDataSource = data;
          option.treeData = data.map(format2TreeData);
        }
      })
      .finally(() => {
        setLoading(false);
        nextTick(() => {
          if (option.treeDataSource.length > 0) {
            treeRef.value.expandAll();
          }
        });
      });
  }, 500);
  const loadData = () => {
    if (props.root) {
      setLoading(true);
      loadDataDebounce();
    } else {
      option.treeData = [];
      option.treeDataSource = [];
    }
  };
  loadData();
  watch(
    () => props.root,
    () => {
      loadData();
    }
  );
  const onAdd = (node) => {
    dialogOption.parent = node || props.root;
    dialogOption.model = null;
    if (dialogOption.parent) {
      dialogOption.visible = true;
    } else {
      Message.info('请先选择分类');
    }
  };
  // 深度遍历treeData
  function findSourceItem(data: ICategory[], nodeId: string) {
    for (let i = 0; i < data.length; i += 1) {
      let result = null as ICategory | null;
      if (data[i].id === nodeId) {
        return data[i];
      }
      if (data[i].children && data[i].children.length) {
        result = findSourceItem(data[i].children as ICategory[], nodeId);
      }
      if (result !== null) {
        return result;
      }
    }
    return null;
  }
  const onEdit = (id) => {
    const node = findSourceItem(treeDataSource.value, id);
    if (node) {
      dialogOption.model = node;
      dialogOption.visible = true;
      dialogOption.parent = null;
    } else {
      Message.info(`请先选择分类${id}`);
    }
  };

  const onDel = (id, done) => {
    del(id)
      .then(() => {
        loadData();
      })
      .finally(() => {
        done();
      });
  };
  const onSuccess = () => {
    loadData();
  };

  const onDrop = ({ dragNode, dropNode, dropPosition }) => {
    sort(formatNodeKey(dragNode.key).id, formatNodeKey(dropNode.key).id, dropPosition).then(() => {
      loadData();
    });
  };
</script>

<style lang="less" scoped>
  .category-comp-children-tree-container {
    min-height: 500px;
    background-color: #fff;

    .header-tools {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 20px;
      color: var(--color-text-1);
      font-weight: 500;
      font-size: 16px;
      line-height: 1.5;
      border-bottom: 1px solid var(--color-neutral-3);
    }

    :deep(.arco-tree) {
      padding: 0 10px;

      .arco-tree-node-title-text {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .text-title {
          color: #333;
          font-size: 14px;
          line-height: 20px;
        }

        .text-key {
          color: #666;
          font-size: 12px;
          line-height: 24px;
        }

        .arco-tree-node-drag-icon {
          position: relative;
          margin-left: 10px;
        }
      }

      .tree-item-btns {
        margin-left: 20px;
      }
    }
  }
</style>
