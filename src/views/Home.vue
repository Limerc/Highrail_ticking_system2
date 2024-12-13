<script setup lang="ts">
  import QueryForm from '@/components/QueryForm.vue';
  import { ElCarouselItem } from 'element-plus';
  import { ref } from 'vue';
  const imgs = ref([
    'https://www.12306.cn/index/images/pic/banner12.jpg',
    'https://www.12306.cn/index/images/pic/banner20201223.jpg',
    'https://www.12306.cn/index/images/pic/banner20200707.jpg',
    'https://www.12306.cn/index/images/pic/banner0619.jpg',
    'https://www.12306.cn/index/images/pic/banner26.jpg',
    'https://www.12306.cn/index/images/pic/banner10.jpg'

  ])
</script>

<template>
  <div class="home-container">
    <div class="query-box">
      <QueryForm />
    </div>
    <ElCarousel :interval="5000" height="450px" motion-blur :autoplay="true">
      <ElCarouselItem v-for="img in imgs" :key="img">
        <img :src="img" :alt="img">
      </ElCarouselItem>
    </ElCarousel>
  </div>
</template>

<style lang="less" scoped>
  .home-container {
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .query-box {
      position: absolute;
      top: 20%;
      left: 10%;
      z-index: 999;
    }
  }
</style>
