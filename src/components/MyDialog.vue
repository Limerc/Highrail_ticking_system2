<script setup lang="ts">
  import { ref } from 'vue';

  const vis = ref(false)
  const type = ref<'success' | 'warning' | 'info' | 'error'>()
  const msg = ref<string>()
  const countSec = ref(3)
  const { countDownMode, countDownCallback } = defineProps<{
    showClose?: boolean,
    countDownMode?: boolean,
    countDownCallback?: () => void,
    width?: string | number,
  }>()

  function show(inpType?: 'success' | 'warning' | 'info' | 'error' | null, inpMsg?: string) {
    if (inpType)
      type.value = inpType
    if (inpMsg)
      msg.value = inpMsg
    vis.value = true
    if (countDownMode) {
      countSec.value = 3
      const timer = setInterval(() => {
        countSec.value--
        if (countSec.value === 0) {
          clearInterval(timer)
          countDownCallback && countDownCallback()
        }
      }, 1000)
    }
  }

  function hide() {
    vis.value = false
  }

  defineExpose({
    show,
    hide
  })
</script>

<template>
  <ElDialog v-model="vis" :close-on-click-modal="false" :close-on-press-escape="false" :showClose :width align-center>
    <div v-if="!type" style="height:70vh">
      <el-scrollbar>
        <slot></slot>
      </el-scrollbar>
    </div>
    <ElResult v-else :icon="type" :title="msg" :sub-title="countDownMode ? `${countSec}秒后跳转...` : ''" />
  </ElDialog>
</template>

<style lang="less" scoped></style>
