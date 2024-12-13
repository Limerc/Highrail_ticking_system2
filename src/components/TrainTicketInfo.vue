<script setup lang="ts">
  import type { Duration } from '@/apis/ticket';
  import { convertDuration } from '@/util';

  defineProps<{
    data: {
      begin_station_name: string
      arrive_station_name: string
      begin_time: string
      begin_date: string
      arrive_time: string
      arrive_date: string
      cost: number
      left_tickets: number
      hideLeft?: boolean
      h_name?: string
      duration?: Duration
      isRefund?: boolean
    }
  }>()
</script>

<template>
  <li class="train" :class="{ refund: data.isRefund }">
    <div class="train-info">
      <div class="begin">
        <div class="station">
          {{ data.begin_station_name }}
        </div>
        <div class="time">
          {{ data.begin_time }}
        </div>
        <div class="date">
          {{ data.begin_date }}
        </div>
      </div>
      <div class="train-icon">
        <span v-if="data.h_name" class="up">{{ data.h_name }}</span>
        <span v-if="data.duration" class="down">{{ convertDuration(data.duration) }}</span>
        <svg t="1732182315768" class="icon" viewBox="0 0 3481 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="8761" width="100" height="100">
          <path
            d="M819.2 512a68.266667 68.266667 0 1 0 136.533333 0 68.266667 68.266667 0 0 0-136.533333 0zM2662.4 512a68.266667 68.266667 0 1 1-136.533333 0 68.266667 68.266667 0 0 1 136.533333 0z"
            fill="#626262" fill-opacity=".8" p-id="8762"></path>
          <path d="M3072 512a68.266667 68.266667 0 1 1-136.533333 0 68.266667 68.266667 0 0 1 136.533333 0z"
            fill="#626262" fill-opacity=".5" p-id="8763"></path>
          <path d="M3481.6 512a68.266667 68.266667 0 1 1-136.533333 0 68.266667 68.266667 0 0 1 136.533333 0z"
            fill="#626262" fill-opacity=".2" p-id="8764"></path>
          <path d="M409.6 512a68.266667 68.266667 0 1 0 136.533333 0 68.266667 68.266667 0 0 0-136.533333 0z"
            fill="#626262" fill-opacity=".5" p-id="8765"></path>
          <path d="M0 512a68.266667 68.266667 0 1 0 136.533333 0 68.266667 68.266667 0 0 0-136.533333 0z" fill="#626262"
            fill-opacity=".2" p-id="8766"></path>
          <path d="M1740.8 512m-512 0a512 512 0 1 0 1024 0 512 512 0 1 0-1024 0Z" fill="#626262" fill-opacity=".08"
            p-id="8767"></path>
          <path
            d="M2044.791467 728.541867a27.648 27.648 0 0 1 27.989333 27.204266 27.511467 27.511467 0 0 1-24.4736 26.965334l-3.515733 0.2048H1306.282667c-10.922667-17.442133-20.821333-35.601067-29.5936-54.408534h768.1024zM1596.791467 238.933333c121.856 0 244.394667 43.997867 343.620266 101.546667l12.288 7.2704h-131.8912v108.680533h272.042667c40.311467 41.5744 63.931733 80.7936 63.931733 108.919467 0 83.421867-36.932267 103.697067-86.016 107.793067l-10.001066 0.6144-10.24 0.273066H1254.980267A511.453867 511.453867 0 0 1 1228.8 512c0-100.386133 28.910933-194.048 78.848-273.066667h289.143467zM1484.8 347.7504h-111.991467v108.817067H1484.8v-108.817067z m224.017067 0H1596.757333v108.817067h112.0256v-108.817067z"
            fill="#626262" p-id="8768"></path>
        </svg>
      </div>
      <div class="arrive">
        <div class="station">
          {{ data.arrive_station_name }}
        </div>
        <div class="time">
          {{ data.arrive_time }}
        </div>
        <div class="date">
          {{ data.arrive_date }}
        </div>
      </div>
    </div>
    <div class="buy">
      <div class="price">￥{{ data.cost }}</div>
      <slot></slot>
      <div v-if="!data.hideLeft" class="left">余{{ data.left_tickets }}</div>
    </div>
  </li>
</template>

<style lang="less" scoped>
  .train {
    display: flex;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    height: 100px;
    border-radius: 10px;

    margin-top: 20px;
    background-color: #F8FAFD;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, .1);

    position: relative;

    &.refund::before {
      cursor: not-allowed;
      content: '已退票';
      color: #F8FAFD;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      line-height: 100%;
      background-color: rgba(0, 0, 0, .4);
      z-index: 999;
      border-radius: 10px;
    }

    .train-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: fit-content;
      height: 100%;

      .train-icon {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .up,
        .down {
          position: absolute;
          font-size: 12px;
          color: #aaa;
          left: 50%;
          transform: translateX(-50%);
        }

        .up {
          top: 20%;
        }

        .down {
          bottom: 20%;
        }
      }

      .begin,
      .arrive {
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .station {
          font-size: 12px;
        }

        .time {
          font-size: 20px;
          font-weight: 900;
        }

        .date {
          font-size: 12px;
        }
      }
    }

    .buy {
      display: flex;
      align-items: center;

      .price {
        margin-right: 10px;
        font-size: 20px;
        font-weight: 900;
        color: #FF7D03;
      }

      .left {
        margin-left: 10px;
        font-size: 12px;
        color: #aaa;
      }
    }
  }
</style>
