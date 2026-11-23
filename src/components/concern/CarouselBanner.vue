<template>
  <a-carousel v-if="list.length" class="carousel-banner" arrows draggable>
    <div v-for="item in list" :key="item.id" class="carousel-item">
      <img :src="item.image" :alt="item.title || '轮播图'" />
    </div>
  </a-carousel>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import carouselApi from '@/api/carousel'
import { toastError } from '@/utils/feedback'

const list = ref([])

onMounted(async () => {
  try {
    const res = await carouselApi.getCarouselList()
    list.value = res.data || []
  } catch (error) {
    toastError(error, '轮播图加载失败')
  }
})
</script>

<style lang="less" scoped>
.carousel-banner {
  :deep(.slick-slide) {
    text-align: center;
  }

  .carousel-item img {
    display: block;
    width: 100%;
    max-height: 260px;
    object-fit: cover;
  }
}
</style>
