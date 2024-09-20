<script setup lang="ts">
import type { loginReq, registerReq } from "~/api/user/type";
import {getLogin, getRegister} from "~/api/user";
import { HttpStatus } from "~/enums/httpStatus";
import { useStorage } from '@vueuse/core'
import type {FormItemRule} from "naive-ui";

const loginShow = ref(false);
const isLogin = ref(true);

const router = useRouter();

const loginForm = ref<loginReq>({
  username: '',
  password: ''
});

const registerForm = ref<registerReq>({
  username: '',
  password: '',
  confirmPassword: ''
});

const formRef = ref()

const token = useStorage('token', '');
const refreshToken = useStorage('refreshToken', '');

const loginRules = {
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

const registerRules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  },
  confirmPassword: {
    required: true,
    message: '请确认密码',
    trigger: 'blur',
    validator: (rule: FormItemRule, value: string) => {
      if (value !== registerForm.value.password) {
        return new Error('两次输入的密码不一致');
      }
      return true;
    }
  }
};

const handleLogin = async () => {
  await formRef.value?.validate()
  const res = await getLogin(loginForm.value);
  if (res.code === HttpStatus.OK) {
    token.value = res.data.token
    refreshToken.value = res.data.refresh_token
    await router.push('/admin')
  }
};

const handleRegister = async () => {
  await formRef.value?.validate()
  const res = await getRegister(registerForm.value);
  if (res.code === HttpStatus.OK) {
    // 注册成功后切换到登录页面
    isLogin.value = true;
  }
};

const toAdmin = async () => {
  if(!token.value) {
    loginShow.value = !loginShow.value
  } else {
    await router.push('/admin')
  }
}

const switchMode = () => {
  isLogin.value = !isLogin.value;
  nextTick(() => {
    formRef.value?.restoreValidation()
    if (isLogin.value) {
      loginForm.value = { username: '', password: '' }
    } else {
      registerForm.value = { username: '', password: '', confirmPassword: '' }
    }
  })
}
</script>

<template>
  <n-modal v-model:show="loginShow" :auto-focus="false">
    <n-card
        w-400
        :title="isLogin ? '登录' : '注册'"
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
          label-width="auto"
          :model="isLogin ? loginForm : registerForm"
          :rules="isLogin ? loginRules : registerRules"
          size="small"
      >
        <n-form-item label="用户名" path="username">
          <n-input v-if="isLogin" v-model:value="loginForm.username" placeholder="请输入用户名"/>
          <n-input v-else v-model:value="registerForm.username" placeholder="请输入用户名"/>
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input v-if="isLogin" v-model:value="loginForm.password" placeholder="请输入密码" show-password-on="click" type="password" @keydown.enter.prevent/>
          <n-input v-else v-model:value="registerForm.password" placeholder="请输入密码" show-password-on="click" type="password" @keydown.enter.prevent/>        </n-form-item>
        <n-form-item v-if="!isLogin" label="确认密码" path="confirmPassword">
          <n-input v-model:value="registerForm.confirmPassword" placeholder="请确认密码" show-password-on="click" type="password" @keydown.enter.prevent/>
        </n-form-item>
      </n-form>

      <div style="text-align: right">
        <n-button attr-type="button" @click="isLogin ? handleLogin() : handleRegister()">
          {{ isLogin ? '登录' : '注册' }}
        </n-button>
      </div>
      <div style="text-align: center; margin-top: 10px">
        <n-button text @click="switchMode">
          {{ isLogin ? '没有账号？点击注册' : '已有账号？点击登录' }}
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
    <nuxt-link class="color-#1e80ff cursor-pointer" m-l-5 @click="toAdmin">
      后台管理
    </nuxt-link>
  </footer>
</template>

<style scoped lang="scss">
</style>