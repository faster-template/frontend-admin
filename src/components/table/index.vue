<template>
  <div class="table-container">
    <a-space class="header-filter">
      <slot name="filter-fields"></slot>
      <a-space class="filter-item">
        <a-button :loading="loading" type="primary" @click="queryList">筛选/刷新</a-button>
        <slot name="filter-button" :loading="loading"></slot>
      </a-space>
    </a-space>
    <a-divider :margin="10"></a-divider>
    <a-table
      :columns="props.columns"
      :data="dataList"
      :pagination="pagination"
      :loading="loading"
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
      <template v-for="slot in columnSlots" :key="slot.name" #[slot.name]="{ record }">
        <slot :name="slot.name" :record="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
  import { reactive, toRefs, PropType, useSlots, computed } from 'vue';
  import { TableColumnData } from '@arco-design/web-vue';
  import { AnyObject, Pagination } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import debounce from 'lodash/debounce';
  import { AxiosResponse } from 'axios';

  const filter = defineModel('filter', {
    type: Object as PropType<AnyObject>,
    required: true,
    default: () => {
      return {};
    },
  });
  const props = defineProps({
    columns: {
      type: Array as PropType<TableColumnData[]>,
      required: true,
    },
    fetchApi: {
      type: Function as PropType<(...args) => Promise<AxiosResponse>>,
      required: true,
    },
  });
  const option = reactive({
    dataList: [],
    pagination: {
      total: 0,
      current: 1,
      pageSize: 20,
    } as Pagination,
  });
  const { dataList, pagination } = toRefs(option);

  const slots = useSlots();
  const curSlotName = ['filter-fields', 'filter-button'];
  const columnSlots = computed(() => {
    if (slots) {
      return Object.keys(slots)
        .filter((key) => !curSlotName.includes(key))
        .map((t) => {
          return { name: t, slot: slots[t] };
        });
    }
    return [];
  });

  const { loading, setLoading } = useLoading();
  const queryListDebounce = debounce(() => {
    const query = {
      ...filter.value,
      page: option.pagination.current,
      size: option.pagination.pageSize,
    };
    props
      .fetchApi(query)
      .then(({ data }) => {
        option.dataList = data.items;
        option.pagination.total = data.total;
      })
      .finally(() => {
        setLoading(false);
      });
  }, 500);

  const queryList = () => {
    setLoading(true);
    queryListDebounce();
  };
  queryList();
</script>

<style lang="less" scoped>
  .table-container {
    margin: 0 20px;
    padding: 10px;
    background-color: #fff;

    .header-filter {
      display: flex;

      .filter-item {
        display: flex;
        align-items: center;

        &-label {
          padding-right: 20px;
          color: #666;
          text-align: right;
        }

        &-input,
        :deep(.filter-item-input) {
          width: 200px;
        }
      }
    }
  }
</style>
