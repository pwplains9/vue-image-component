<template>
  <div class="app">
    <h1>Vue Picture Compressor Example</h1>
    <Picture
      src="/images/photo.jpg"
      alt="Example photo"
      loading="lazy"
      :webp="true"
      @load="onImageLoad"
    />
  </div>
</template>

<script setup lang="ts">
import { Picture } from '../src/index'

const onImageLoad = (event: Event) => {
  console.log('Image loaded:', event)
}
</script>

<style scoped>
.app {
  padding: 20px;
  text-align: center;
}
</style>



