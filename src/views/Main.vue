<script setup lang="ts">
  import type { UserInfo } from '@/apis/user';
  import { useUserStore } from '@/stores/user';
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';

  const router = useRouter()
  const userStore = useUserStore();
  const userInfo = ref<UserInfo>()

  async function init(force: boolean = false) {
    userInfo.value = await userStore.getUserInfo(force)
  }
  init()
  watch(() => userStore.getUserUpdateStatus(), () => {
    init(true)
  })
</script>

<template>
  <header>
    <img class="logo" @click="router.push({ name: 'main' })" src="https://www.12306.cn/index/images/logo@2x.png"
      alt="12306-logo">
    <div class="header-right">
      <ElButton v-if="!userInfo" @click="router.push({ name: 'login' })">登录</ElButton>
      <div style="display: flex;align-items: center;" v-else>欢迎您，<ElLink type="primary"
          @click="router.push({ name: 'my' })">{{ userInfo.username
          }}</ElLink>!</div>
    </div>
  </header>
  <RouterView />
</template>

<style lang="less" scoped>
  header {
    position: relative;
    width: 100%;
    height: 80px;
    padding-left: 50px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;

    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 4px;
      border-radius: 25%;
      background-color: #3B99FC;
      position: absolute;
      bottom: 0;
      left: 0;
    }

    .logo {
      width: 200px;
      cursor: pointer;
    }

    .header-right {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      flex: 1;
      height: 80%;
      padding-right: 50px;
      background-image: url('https://www.12306.cn/index/images/train@2x.png');
    }
  }
</style>
