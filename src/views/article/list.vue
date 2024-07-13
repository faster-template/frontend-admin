<template>
  <div class="article-list-container">
    <custom-table ref="tableRef" v-model:filter="filter" :fetch-api="list" :columns="columns">
      <template #filter-fields>
        <div class="filter-item">
          <div class="filter-item-label">分类</div>
          <categorySelector
            v-model="filter.categoryId"
            parent-key="ARTICLE"
            :class-name="'filter-item-input'"
          >
          </categorySelector>
        </div>
        <div class="filter-item">
          <div class="filter-item-label">标题</div>
          <a-input v-model="filter.title" class="filter-item-input" placeholder="输入标题筛选">
          </a-input>
        </div>
      </template>
      <template #filter-button> <a-button @click="createNew">新增</a-button></template>
      <template #category="{ record }">
        {{ record.category && record.category.name }}
      </template>
      <template #createTime="{ record }">
        {{ record.createTime }}
      </template>
      <template #creator="{ record }">
        {{ record.creator.nickName }}
      </template>
      <template #state="{ record }">
        {{ $t(`state.${state[record.state]}`)
        }}<a-popconfirm
          :content="`确定${record.state == 1 ? '下架' : '发布'}么？`"
          type="warning"
          :on-before-ok="(done) => changeState(record, done)"
        >
          <a-button
            style="margin-left: 20px"
            size="mini"
            type="dashed"
            :status="record.state == 0 ? 'success' : 'warning'"
          >
            <template #icon>
              <icon-check-circle v-if="record.state == 0" />
              <icon-minus-circle v-else />
            </template>
            {{ record.state == 0 ? '发布' : '下架' }}
          </a-button></a-popconfirm
        >
      </template>
      <template #operator="{ record }">
        <a-space>
          <a-button size="mini" @click="onPreview(record.id)">
            <template #icon> <icon-eye /> </template>预览</a-button
          >
          <a-button size="mini" @click="router.push(`/article/edit/${record.id}`)">
            <template #icon> <icon-edit /> </template>编辑</a-button
          >
          <a-popconfirm
            content="确定删除这篇文章么？"
            type="warning"
            :on-before-ok="(done) => delOne(record.id, done)"
          >
            <a-button size="mini" type="primary" status="danger" :disabled="record.state === 1">
              <template #icon> <icon-delete /> </template>删除</a-button
            ></a-popconfirm
          >
        </a-space>
      </template>
    </custom-table>

    <previewDialog
      v-if="preivewOption.visible"
      :id="preivewOption.id"
      v-model:visible="preivewOption.visible"
    ></previewDialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, toRefs } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';

  import { del, list, publish, unPublish } from '@/api/article';
  import { state } from '@/constants';
  import categorySelector from '@/components/category/selector.vue';
  import customTable from '@/components/table/index.vue';
  import previewDialog from './components/previewDialog.vue';

  const router = useRouter();
  const option = reactive({
    dataList: [],
    filter: {
      title: '',
      categoryId: null,
    },
  });
  const { filter } = toRefs(option);
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '分类',
      dataIndex: 'category',
      slotName: 'category',
      width: 100,
    },
    {
      title: '更新时间',
      dataIndex: 'createTime',
      slotName: 'createTime',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '作者',
      dataIndex: 'creator',
      slotName: 'creator',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'state',
      slotName: 'state',
      width: 160,
    },
    {
      title: '操作',
      dataIndex: 'operator',
      slotName: 'operator',
    },
  ];

  const preivewOption = reactive({
    id: '',
    visible: false,
  });
  const onPreview = (id) => {
    preivewOption.id = id;
    preivewOption.visible = true;
  };
  const createNew = () => {
    router.push('/article/create');
  };
  const tableRef = ref();
  const changeState = (article, done) => {
    const func = article.state === 1 ? unPublish : publish;
    func(article.id)
      .then(() => {
        Message.success(`${article.state === 1 ? '下架' : '发布'}成功`);
        tableRef.value.queryList();
      })
      .finally(() => {
        done();
      });
  };
  const delOne = (id, done) => {
    del(id)
      .then(() => {
        tableRef.value.queryList();
      })
      .finally(() => {
        done(true);
      });
  };
</script>

<style lang="less" scoped>
  .article-list-container {
    margin: 0 20px;
    padding: 10px;
    background-color: #fff;
  }
</style>
