<script setup lang="ts">
  import { buyTicket, queryTicket, type Duration, type QueryTicketReq, type QueryTicketResp } from '@/apis/ticket';
  import MyDialog from '@/components/MyDialog.vue';
  import QueryForm from '@/components/QueryForm.vue';
  import TrainTicketInfo from '@/components/TrainTicketInfo.vue';
  import { convertDate, splitDateTime } from '@/util';
  import { onMounted, ref, watch } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  const router = useRouter()
  const route = useRoute()
  const dialogRef = ref<InstanceType<typeof MyDialog>>()
  export type Train = (QueryTicketResp[number] & {
    begin_date: string
    arrive_date: string
    cost: number
  })[]
  const trains = ref<Train>([])
  const query = ref(route.query as unknown as QueryTicketReq)
  const queryFormRef = ref<InstanceType<typeof QueryForm>>()

  async function init() {
    query.value = route.query as unknown as QueryTicketReq
    const res = await queryTicket(query.value)
    trains.value = res.map(splitDateTime) as Train;
    queryFormRef.value?.assignData({
      ...query.value,
      start_date: convertDate(query.value.start_date as string)
    })
  }

  async function buy(h_id: number, begin_station: string, arrive_station: string, begin_station_interval: number, arrive_station_interval: number, d: Duration) {
    const duration = `${(d.hours + d.days * 24).toString().padStart(2, '0')}:${d.minutes.toString().padStart(2, '0')}:${d.wholeSeconds.toString().padStart(2, '0')}`
    await buyTicket({
      h_id, begin_station, arrive_station,
      begin_station_interval, arrive_station_interval, duration
    })
    dialogRef.value?.show('success', '购票成功!')
  }

  onMounted(() => {
    init()
  })

  watch(() => route.query, () => { init() })
</script>

<template>
  <QueryForm ref="queryFormRef" inline />
  <ul class="train-list">
    <template v-for="t in trains">
      <TrainTicketInfo :data="{ ...t, ...query }">
        <ElButton type="primary"
          @click="buy(t.h_id, t.begin_station, t.arrive_station, t.begin_tid, t.arrive_tid, t.duration)">购票</ElButton>
      </TrainTicketInfo>
    </template>

  </ul>
  <MyDialog ref="dialogRef" count-down-mode :count-down-callback="() => router.push({ name: 'myTickets' })" />
</template>

<style lang="less" scoped>
  * {
    list-style: none;
  }

  .train-list {
    width: 80%;
    margin: 0 auto;
  }
</style>
