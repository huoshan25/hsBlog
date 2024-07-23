<script setup lang="ts">
import type {loginReq} from "~/api/user/type";
import {getLogin} from "~/api/user/indexFetch";
import {HttpStatus} from "~/enums/httpStatus";

const showModal = ref(false);

const form = ref<loginReq>({
  username: '',
  password: ''
});

const formRef = ref()

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
};

const handleSubmit = async () => {
  await formRef.value?.validate()
  const res = await getLogin(form.value);
  if (res.code === HttpStatus.OK) {
  }
};

const toAdming = () => {
  showModal.value = !showModal.value
}
</script>

<template>
  <n-modal v-model:show="showModal" :auto-focus="false">
    <n-card
        w-400
        title="登录"
        :bordered="false"
        size="huge"
        require-mark-placement="right-hanging"
        role="dialog"
        aria-modal="true"
        :style="{
            maxWidth: '640px'
          }"
    >
      <n-form
          ref="formRef"
          :inline="false"
          label-placement="left"
          :model="form"
          :rules="rules"
          size="small"
      >
        <n-form-item label="姓名" path="username">
          <n-input v-model:value="form.username" placeholder="请输入账户"/>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-model:value="form.password" placeholder="请输入密码" show-password-on="click" type="password" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

      <div style="text-align: right">
        <n-button attr-type="button" @click="handleSubmit()">
          提交
        </n-button>
      </div>
    </n-card>
  </n-modal>

  <footer flex justify-center p-22>
    2024 © Powered by
    <div style="color: #1e80ff; margin: 0 5px; cursor: pointer">
      hsBlog
    </div>
    |
    <nuxt-link style="color: #1e80ff;" m-l-5 to="/admin">
      后台管理
    </nuxt-link>
  </footer>
</template>

<style scoped lang="scss">
</style>