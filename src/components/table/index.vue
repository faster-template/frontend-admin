<template>
  <div class="table-container">
    <div class="header-filter">
      <slot name="filter-fields"></slot>
      <a-button :loading="loading" type="primary" @click="queryList">筛选/刷新</a-button>
      <slot name="filter-button" :loading="loading"></slot>
    </div>
    <a-divider :margin="10"></a-divider>
    <a-table
      :columns="props.columns"
      :data="dataList"
      :pagination="pagination4Table"
      :loading="loading"
      @page-change="
        (page) => {
          pagination4Table.current = page;
          queryList();
        }
      "
      @page-size-change="
        (pageSize) => {
          pagination4Table.pageSize = pageSize;
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
  import { AnyObject, Pagination, PaginationQuery } from '@/types/global';
  import useLoading from '@/hooks/loading';
  import { debounce } from '@/utils/debounce';
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
    pagination: {
      type: [Object, false] as PropType<PaginationQuery | false>,
      default: () => {
        return {
          size: 20,
          page: 1,
          // order: 'desc',
          // orderBy: 'createTime',
        } as PaginationQuery;
      },
    },
  });
  const option = reactive({
    dataList: [],
    // 给ArcoTable用的分页数据
    pagination4Table: {
      total: 0,
      current: (props.pagination && props.pagination.page) || 1,
      pageSize: (props.pagination && props.pagination.size) || 1,
    } as Pagination,
  });
  const { dataList, pagination4Table } = toRefs(option);

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
  const queryList = debounce(
    () => {
      setLoading(true);
      const query = {
        ...filter.value,
      };
      if (props.pagination) {
        Object.assign(query, {
          page: option.pagination4Table.current,
          size: option.pagination4Table.pageSize,
        });
      }
      props
        .fetchApi(query)
        .then(({ data }) => {
          option.dataList = data.items || data;
          option.pagination4Table.total = data.total || data.length;
        })
        .finally(() => {
          setLoading(false);
        });
    },
    500,
    true
  );
  queryList();
  defineExpose({ queryList });
</script>

<style lang="less" scoped>
  .table-container {
    background-color: #fff;

    :deep(.header-filter),
    .header-filter {
      display: flex;

      .filter-item {
        display: flex;
        align-items: center;
        word-break: keep-all;

        &-label {
          padding-right: 8px;
          color: #666;
          text-align: right;
        }

        &-input,
        .filter-item-input {
          width: 180px;
        }
      }

      & > *:nth-last-child(n + 1) {
        margin-right: 12px;
      }
    }
  }
</style>
