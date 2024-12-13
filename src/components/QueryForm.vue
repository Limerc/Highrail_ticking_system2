<script setup lang="ts">
  import type { QueryTicketReq } from '@/apis/ticket';
  import { useUserStore } from '@/stores/user';
  import { convertDate } from '@/util';
  import { ElMessageBox, type FormInstance, type FormRules } from 'element-plus';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  const userStore = useUserStore()
  const router = useRouter()
  const shortcuts = ref([{
    text: '今天',
    value: new Date()
  }, {
    text: '明天',
    value() {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    }
  }, {
    text: '11-15',
    value: new Date('2024-11-15')
  }])
  const { inline, callback } = defineProps<{ inline?: boolean, callback?: (arg: QueryTicketReq) => void }>()
  const fromRef = ref<FormInstance>()
  const formVal = ref<QueryTicketReq>({
    begin_station_name: '',
    arrive_station_name: '',
    start_date: new Date('2024-11-15')
  })
  const rules = ref<FormRules<QueryTicketReq>>({
    begin_station_name: [{
      required: true,
      message: '请输入出发地',
      trigger: ['blur', 'change']
    }],
    arrive_station_name: [{
      required: true,
      message: '请输入目的地',
      trigger: ['blur', 'change']
    }],
    start_date: [{
      required: true,
      message: '请选择出发日期',
      trigger: ['blur', 'change']
    }]
  })
  function submit() {
    if (!userStore.getToken()) {
      ElMessageBox.confirm('您还未登录，是否前往登录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        router.push({ name: 'login' })
      }).catch(() => { })
      return
    }
    fromRef.value?.validate(async valid => {
      if (!valid)
        return
      let start_date = ''
      if (formVal.value.start_date instanceof Date) {
        start_date = convertDate(formVal.value.start_date)
      }
      const query = {
        ...formVal.value,
        start_date
      }
      // 拦截动作
      if (callback) {
        callback(query)
        return
      }
      router.push({
        name: 'trains',
        query
      })
    })
  }
  function assignData(data: QueryTicketReq) {
    formVal.value = data
  }
  defineExpose({
    assignData
  })
</script>

<template>
  <div class="query-container" :style="{ width: inline ? 'auto' : '400px' }">
    <ElForm @submit.prevent="submit" ref="fromRef" :rules :model="formVal" :inline label-width="auto">
      <ElFormItem label="出发地" prop="begin_station_name">
        <ElInput v-model.trim="formVal.begin_station_name" placeholder="请输入出发地"></ElInput>
      </ElFormItem>
      <ElFormItem label="目的地" prop="arrive_station_name">
        <ElInput v-model.trim="formVal.arrive_station_name" placeholder="请输入目的地"></ElInput>
      </ElFormItem>
      <ElFormItem label="出发日期" prop="start_date">
        <ElDatePicker v-model="formVal.start_date" type="date" :shortcuts placeholder="请选择出发日期"></ElDatePicker>
      </ElFormItem>
      <ElFormItem label=" ">
        <ElButton native-type="submit" type="primary">查询</ElButton>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<style lang="less" scoped>

  .query-container {
    z-index: 999;
    width: 400px;

    background-color: #fff;
    border-radius: 10px;
    box-shadow: 1px 1px 5px rgba(0, 0, 0, .2);
    padding: 20px 60px;
  }
</style>
