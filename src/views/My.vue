<script setup lang="ts">
  import { Tickets, User, Lock } from '@element-plus/icons-vue';
  import { ref, watch } from 'vue';
  import { useRoute } from 'vue-router';

  const route = useRoute()
  const active = ref('/main/my/info')
  watch(() => route.path, nval => {
    active.value = nval
  }, { immediate: true })
</script>

<template>
  <div class="my-container">
    <ElMenu style="width: fit-content;height: 100%;" :default-active="active" router>
      <ElMenuItem index="/main/my/info">
        <ElIcon>
          <User />
        </ElIcon>
        <span>个人信息</span>
      </ElMenuItem>
      <ElMenuItem index="/main/my/repwd">
        <ElIcon>
          <Lock />
        </ElIcon>
        <span>修改密码</span>
      </ElMenuItem>
      <ElMenuItem index="/main/my/tickets">
        <ElIcon>
          <Tickets />
        </ElIcon>
        <span>购票记录</span>
      </ElMenuItem>
    </ElMenu>
    <RouterView />
  </div>
</template>

<style lang="less" scoped>
  .my-container {
    display: flex;
    height: calc(100% - 84px);
    width: 100%;
  }
</style>
