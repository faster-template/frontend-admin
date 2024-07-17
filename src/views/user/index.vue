<template>
  <div class="user-container">
    <custom-table ref="tableRef" v-model:filter="filter" :columns="columns" :fetch-api="list">
      <template #filter-fields>
        <div class="filter-item">
          <div class="filter-item-label">用户名</div>
          <a-input v-model="filter.userName" class="filter-item-input" placeholder="输入用户名筛选">
          </a-input>
        </div>
        <div class="filter-item">
          <div class="filter-item-label">昵称</div>
          <a-input v-model="filter.nickName" class="filter-item-input" placeholder="输入昵称筛选">
          </a-input>
        </div>
        <div class="filter-item">
          <div class="filter-item-label">角色</div>
          <a-select
            v-model="filter.role"
            class="filter-item-input"
            placeholder="选择角色筛选"
            allow-clear
          >
            <a-option
              v-for="item in userRoleOptions"
              :key="(item.value as string)"
              :value="(item.value as string)"
              >{{ item.label }}</a-option
            >
          </a-select>
        </div>
        <div class="filter-item">
          <div class="filter-item-label">状态</div>
          <a-select
            v-model="filter.state"
            class="filter-item-input"
            placeholder="选择状态筛选"
            allow-clear
          >
            <a-option
              v-for="item in object2Options(userState)"
              :key="(item.value as string)"
              :value="(item.value as string)"
              >{{ item.label }}</a-option
            >
          </a-select>
        </div>
      </template>
      <template #phone="{ record }">
        {{ record.phone || '-' }}
      </template>
      <template #bindWx="{ record }">
        <a-tag :color="record.bindWx == false ? 'arcoblue' : 'green'">{{
          record.bindWx == false ? '否' : '是'
        }}</a-tag>
      </template>

      <template #roles="{ record }">
        <a-tag v-for="item in record.roles" :key="item" color="orange">{{ item }}</a-tag>
      </template>
      <template #state="{ record }">
        {{ userState[record.state] || '-' }}
      </template>
      <template #operator="{ record }">
        <a-space>
          <a-popconfirm
            content="确定禁用这个用户么？"
            type="warning"
            :on-before-ok="
              (done) => {
                disableUser(record, done);
              }
            "
          >
            <a-button size="mini" type="primary" status="danger" :disabled="record.state === 0">
              <template #icon> <icon-stop /> </template>禁用</a-button
            ></a-popconfirm
          >
        </a-space>
      </template>
    </custom-table>
  </div>
</template>

<script setup lang="ts">
  import { reactive, ref, toRefs } from 'vue';
  import { userState, userRoleOptions } from '@/constants';
  import { list, setState } from '@/api/user-manage';
  import { debounce } from '@/utils/debounce';
  import { object2Options } from '@/utils/global';
  import customTable from '@/components/table/index.vue';

  const option = reactive({
    dataList: [],
    filter: {
      userName: '',
      nickName: '',
      state: '',
      role: '',
    },
  });
  const { filter } = toRefs(option);
  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      ellipsis: true,
      tooltip: true,
      width: 200,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 100,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      slotName: 'phone',
    },
    {
      title: '绑定微信',
      dataIndex: 'bindWx',
      slotName: 'bindWx',
    },
    {
      title: '角色',
      dataIndex: 'roles',
      slotName: 'roles',
    },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      width: 200,
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

  const tableRef = ref();
  const disableUser = debounce(
    (record, done) => {
      if (record) {
        setState(record.id, -2)
          .then(() => {
            record.state = -2;
          })
          .finally(() => {
            done();
          });
      }
    },
    500,
    true
  );
</script>

<style lang="less" scoped>
  .user-container {
    margin: 0 10px;
    padding: 10px;
    background-color: #fff;
  }
</style>
