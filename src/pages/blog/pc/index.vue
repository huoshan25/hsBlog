<script setup lang="ts">
import {getLogin} from "~/api/user/indexFetch";
import type {loginReq} from "~/api/user/type";
import { NIcon} from "naive-ui";
import type { MenuOption } from 'naive-ui'
import {HttpStatus} from "~/enums/httpStatus";
import type {Component} from 'vue';
import {
  PersonOutline,
  WineOutline
} from '@vicons/ionicons5'
definePageMeta({
  layout: 'pc'
});

const showModal = ref(false);

const form = ref<loginReq>({
  username: '',
  password: ''
});

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
  const res = await getLogin(form.value);
  if (res.code === HttpStatus.OK) {
  }
};

const activeKey = ref(1);

/**渲染自定义icon*/
const renderIcon = (icon: Component ) => {
  return () => h(NIcon, null, { default: () => h(icon) })
}
const menuOptions: MenuOption[] = [
  { label: 'nuxt', key: '1', icon: renderIcon(WineOutline)},
  { label: 'nest', key: '2', icon: renderIcon(PersonOutline)}
]
</script>

<template>
  <main class="container main-container">
    <div style="margin-top: 30px">
      <n-menu
          class="nav-left"
          v-model:value="activeKey"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :options="menuOptions"
      />
      <div v-show="false">屏幕小的导航栏</div>
      <div>右侧</div>
    </div>
  </main>
    <n-button @click="showModal = !showModal">
      来吧
    </n-button>
    <n-modal v-model:show="showModal" :auto-focus="false">
      <n-card
          style="width: 400px"
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
          <n-form-item>
            <n-button attr-type="button" @click="handleSubmit()">
              提交
            </n-button>
          </n-form-item>
        </n-form>
      </n-card>
    </n-modal>
</template>

<style scoped lang="scss">
.test {
  height: 600px;
  overflow-y: auto;
  border: 1px solid red;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-left {
  border: 1px solid red;
}

.container {
  position: relative;
  margin: 0 auto;
  width: 100%;
  max-width: 960px;
}
</style>