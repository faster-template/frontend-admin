<template>
  <div class="article-list-container">
    <a-space class="header-filter">
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
      <a-space class="filter-item">
        <a-button
          type="primary"
          @click="
            () => {
              pagination.current = 1;
              queryList();
            }
          "
          >筛选</a-button
        >
        <a-button @click="createNew">新增</a-button>
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <!-- 列表 -->
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="pagination"
      :loading="tableLoad.loading.value"
      @page-change="
        (page) => {
          pagination.current = page;
          queryList();
        }
      "
      @page-size-change="
        (pageSize) => {
          pagination.pageSize = pageSize;
          queryList();
        }
      "
    >
      <template #title="{ record }">
        {{ record.title.slice(0, 20) + record.title.length > 20 ? '...' : '' }}
      </template>
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
          :on-before-ok="
            (done) => {
              changeState(record, done);
            }
          "
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
            :on-before-ok="
              (done) => {
                delOne(record.id, done);
              }
            "
          >
            <a-button size="mini" type="primary" status="danger" :disabled="record.state==1">
              <template #icon> <icon-delete /> </template>删除</a-button
            ></a-popconfirm
          >
        </a-space>
      </template>
    </a-table>
    <previewDialog
      v-if="preivewOption.visible"
      :id="preivewOption.id"
      v-model:visible="preivewOption.visible"
    ></previewDialog>
  </div>
</template>

<script setup lang="ts">
  import { reactive, toRefs } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message } from '@arco-design/web-vue';

  import { del, list, publish, unPublish } from '@/api/article';
  import { state } from '@/consts';
  import categorySelector from '@/components/category/selector.vue';
  import useLoading from '@/hooks/loading';
  import { debounce } from 'lodash-es';
  import previewDialog from './components/previewDialog.vue';

  const router = useRouter();
  const option = reactive({
    dataList: [],
    filter: {
      title: '',
      categoryId: null,
    },
    pagination: {
      total: 0,
      current: 1,
      pageSize: 20,
    },
  });
  const { filter, dataList, pagination } = toRefs(option);
  const tableLoad = useLoading();
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
  const queryListDebounce = debounce(() => {
    const query = {
      ...option.filter,
      page: option.pagination.current,
      size: option.pagination.pageSize,
    };
    list(query)
      .then(({ data }) => {
        option.dataList = data.items;
        option.pagination.total = data.total;
      })
      .finally(() => {
        tableLoad.setLoading(false);
      });
  }, 500);
  const queryList = () => {
    tableLoad.setLoading(true);
    queryListDebounce();
  };
  queryList();

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
  const changeState = (article, done) => {
    const func = article.state === 1 ? unPublish : publish;

    func(article.id)
      .then(() => {
        Message.success(`${article.state === 1 ? '下架' : '发布'}成功`);
        queryList();
      })
      .finally(() => {
        done();
      });
  };
  const delOne = (id, done) => {
    del(id)
      .then(() => {
        queryList();
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
    background-color: #ffffff;

    .header-filter {
      display: flex;

      .filter-item {
        display: flex;
        align-items: center;

        &-label {
          width: 60px;
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
  }
</style>
