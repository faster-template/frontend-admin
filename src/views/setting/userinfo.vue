<template>
  <div class="setting-userinfo-container">
    <a-form
      ref="userFormRef"
      class="user-info-form"
      :model="form"
      :rules="rules"
      :label-col-props="{ span: 2, offset: 0 }"
      label-align="left"
    >
      <a-form-item field="avatarUrl" label="头像" row-class="row">
        <UploadImage
          v-model:url="form.avatarUrl"
          :data="{ folderPath: 'avatar', width: 100, height: 100 }"
          text="上传头像"
          @success="
            (url) => {
              onChangeUserAvatar(url);
            }
          "
        ></UploadImage>
      </a-form-item>

      <a-form-item field="nickName" label="昵称" row-class="row" hide-asterisk>
        <a-input v-model="form.nickName" placeholder="请输入昵称" />
        <a-button type="primary" @click="onChangeNickName">提交</a-button>
      </a-form-item>
      <a-form-item
        field="userName"
        label="用户名"
        row-class="row"
        tooltip="修改用户名将重新登陆"
        hide-asterisk
      >
        <a-input v-model="form.userName" placeholder="请输入用户名" />
        <a-button class="content-btn" type="primary" @click="onChangeUserName">提交</a-button>
      </a-form-item>
      <a-form-item field="pwd" label="修改密码" row-class="row" tooltip="修改密码将重新登陆">
        <a-form
          ref="resetPwdFormRef"
          :rules="resetPwdRules"
          :model="resetPwdForm"
          :style="{ width: '600px' }"
          :label-col-props="{ span: 3, offset: 0 }"
          @submit="onResetPwd"
        >
          <a-form-item field="oldPassword" label="原密码" hide-asterisk>
            <a-input-password
              v-model="resetPwdForm.oldPassword"
              placeholder="请输入原密码"
              :default-visibility="true"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="newPassword" label="新密码" hide-asterisk>
            <a-input-password
              v-model="resetPwdForm.newPassword"
              placeholder="新密码"
              :default-visibility="true"
              allow-clear
            />
          </a-form-item>
          <a-form-item field="newPasswordTwice" hide-asterisk>
            <a-input-password
              v-model="resetPwdForm.newPasswordTwice"
              placeholder="再次输入新密码"
              :default-visibility="true"
              allow-clear
            />
          </a-form-item>
          <a-form-item>
            <a-button html-type="submit" type="primary">提交</a-button>
          </a-form-item>
        </a-form>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive } from 'vue';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import { modifyNickName, modifyPwd, modifyUserName, modifyAvatar } from '@/api/user';
  import { debounce } from 'lodash';
  import { RegNickName, RegPassword, RegUserName } from '@/consts';
  import UploadImage from '@/components/upload/uploadImage.vue';

  const userStore = useUserStore();

  const userFormRef = ref();
  const form = reactive({
    userName: userStore.userName,
    nickName: userStore.nickName,
    avatarUrl: userStore.avatarUrl,
  });
  const rules = {
    nickName: [{ required: true, message: '请输入昵称', trigger: 'change' }, { ...RegNickName }],
    userName: [{ required: true, message: '请输入用户名', trigger: 'change' }, { ...RegUserName }],
  };
  const onChangeUserAvatar = (url) => {
    userFormRef.value.validateField('avatarUrl').then((res) => {
      if (!res) {
        modifyAvatar(url).then(() => {
          userStore.setInfo({ avatarUrl: url });
        });
      }
    });
  };

  const modifyUserNameDebounce = debounce(() => {
    modifyUserName(form.userName as string).then(() => {
      Message.success('修改成功,3s后将重新登陆');
      setTimeout(() => {
        userStore.logout();
      }, 3000);
    });
  }, 500);
  const onChangeUserName = () => {
    userFormRef.value.validateField('userName').then((res) => {
      if (!res) {
        modifyUserNameDebounce();
      }
    });
  };
  const modifyNickNameDebounce = debounce(() => {
    modifyNickName(form.nickName as string).then(() => {
      Message.success('修改成功');
      userStore.setInfo({ nickName: form.nickName as string });
    });
  }, 500);
  const onChangeNickName = () => {
    userFormRef.value.validateField('nickName').then((res) => {
      if (!res) {
        modifyNickNameDebounce();
      }
    });
  };

  const resetPwdFormRef = ref();
  const resetPwdForm = reactive({
    oldPassword: '',
    newPassword: '',
    newPasswordTwice: '',
  });
  const resetPwdRules = {
    newPassword: [
      {
        ...RegPassword,
      },
    ],
    newPasswordTwice: [
      {
        validator: (_value, callback) => {
          if (resetPwdForm.newPassword !== resetPwdForm.newPasswordTwice) {
            callback('两次输入的密码不一致!');
          } else {
            callback();
          }
        },
        trigger: 'change',
      },
    ],
  };
  const modifyPwdDebounce = debounce(() => {
    modifyPwd(resetPwdForm.oldPassword, resetPwdForm.newPassword).then(() => {
      Message.success('修改成功,3s后将重新登陆');
      setTimeout(() => {
        userStore.logout();
      }, 3000);
    });
  }, 500);
  const onResetPwd = () => {
    resetPwdFormRef.value.validate().then((res) => {
      if (!res) {
        modifyPwdDebounce();
      }
    });
  };
</script>

<style lang="less" scoped>
  .setting-userinfo-container {
    margin: 0 20px;
    min-height: 500px;
    .user-info-form {
    }
    .row {
      background-color: #ffffff;
      display: flex;
      align-items: center;
      width: 100%;
      margin-bottom: 20px;
      padding: 30px 20px;
      border-radius: 8px;
      :deep(.arco-input-wrapper) {
        width: 320px;
      }
    }
  }
</style>
