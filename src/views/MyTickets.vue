<script setup lang="ts">
  import { getArrivalTime, getBeginTime, getStationName } from '@/apis/station';
  import { delTicketChange, getTicketHistory, putTicketChange, queryTicket, type Duration, type QueryTicketReq, type TicketHistoryResp } from '@/apis/ticket';
  import MyDialog from '@/components/MyDialog.vue';
  import QueryForm from '@/components/QueryForm.vue';
  import TrainTicketInfo from '@/components/TrainTicketInfo.vue';
  import { useUserStore } from '@/stores/user';
  import { splitDateTime } from '@/util';
  import { ref } from 'vue';
  import type { Train } from './Trains.vue';
  import { ElMessage, ElMessageBox } from 'element-plus';
  const userStore = useUserStore()

  type History = (TicketHistoryResp[number] & {
    begin_date: string
    begin_time: string
    arrive_date: string
    arrive_time: string
    begin_station_name: string
    arrive_station_name: string
  })[]

  const histories = ref<History>([])
  async function init() {
    const res = await getTicketHistory((await userStore.getUserInfo())?.id!)
    const proms = res.map(async e => {
      const [
        begin_station_name,
        arrive_station_name,
        begin_time,
        arrive_time
      ] = await Promise.all([
        getStationName(e.beginStation),
        getStationName(e.arriveStation),
        getBeginTime(e.beginTid),
        getArrivalTime(e.arriveTid)])
      return {
        ...e,
        begin_station_name, arrive_station_name,
        begin_time: begin_time.slice(0, 5), arrive_time: arrive_time.slice(0, 5),
        begin_date: '', arrive_date: '',
      }
    })
    histories.value = await Promise.all(proms)
  }
  init()
  const dialogRef = ref<InstanceType<typeof MyDialog>>()
  let curOid = 0
  let curPrice = 0
  function changeOid(oId: number, price: number) {
    curOid = oId
    curPrice = price
    dialogRef.value?.show()
  }

  const trainsQuery = ref<QueryTicketReq>({
    begin_station_name: '',
    arrive_station_name: '',
    start_date: ''
  })
  async function queryTrainFunc(data: QueryTicketReq) {
    trainsQuery.value = data
    const res = await queryTicket(trainsQuery.value)
    trains.value = res.map(splitDateTime) as Train;
  }
  async function dealTicketChange(h_id: number, begin_tid: number, arrive_tid: number, d: Duration, cost: number) {
    const duration = `${(d.hours + d.days * 24).toString().padStart(2, '0')}:${d.minutes.toString().padStart(2, '0')}:${d.wholeSeconds.toString().padStart(2, '0')}`
    const diff = cost - curPrice
    let msg = ''
    if (diff > 0) {
      msg = `需补差价${diff.toFixed(2)}元`
    } else if (diff < 0) {
      msg = `可退差价${(-diff).toFixed(2)}元`
    } else {
      msg = '无需退、补费用'
    }
    await ElMessageBox.confirm(`确定改签吗?${msg}`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await putTicketChange({ o_id: curOid, h_id, begin_tid, arrive_tid, duration })
    ElMessage.success('改签成功!正在刷新...')
    dialogRef.value?.hide()
    init()
  }

  async function dealDeleteTicket(oId: number) {
    await ElMessageBox.confirm(`确定退票吗?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await delTicketChange(oId)
    ElMessage.success('退票成功!正在刷新...')
    init()
  }

  const trains = ref<Train>([])
</script>

<template>
  <div class="my-tickets-container">
    <ul class="history">
      <template v-for="row in histories" :key="row.o_id">
        <TrainTicketInfo :data="{ ...row, cost: row.fee, left_tickets: 0, hideLeft: true }">
          <ElButton type="success" :disabled="row.ticketChange" @click="changeOid(row.oid, row.fee)">改签</ElButton>
          <ElButton type="danger" @click="dealDeleteTicket(row.oid)">退票</ElButton>
        </TrainTicketInfo>
      </template>
    </ul>
  </div>
  <MyDialog ref="dialogRef" show-close width="96%">
    <QueryForm inline :callback="queryTrainFunc" />
    <TrainTicketInfo v-for="t in trains" :data="{ ...t, ...trainsQuery }">
      <ElButton type="primary" @click="dealTicketChange(t.h_id, t.begin_tid, t.arrive_tid, t.duration, t.cost)">选择
      </ElButton>
    </TrainTicketInfo>
  </MyDialog>
</template>

<style lang="less" scoped>
  .my-tickets-container {
    width: 100%;
    height: 100%;

    .history {
      width: 80%;
      margin: 0 auto;
    }

  }
</style>
