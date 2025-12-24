<template>
  <picture>
    <source
      v-if="webpSrc"
      :srcset="webpSrc"
      type="image/webp"
    />
    <img
      :src="src"
      :alt="alt"
      :loading="loading"
      :class="imgClass"
      :style="imgStyle"
      @load="onLoad"
      @error="onError"
    />
  </picture>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface PictureProps {
  src: string
  alt?: string
  loading?: 'lazy' | 'eager'
  imgClass?: string
  imgStyle?: string | Record<string, any>
  webp?: boolean
}

const props = withDefaults(defineProps<PictureProps>(), {
  alt: '',
  loading: 'lazy',
  imgClass: '',
  imgStyle: () => ({}),
  webp: true
})

const emit = defineEmits<{
  load: [event: Event]
  error: [event: Event]
}>()

const webpSrc = computed(() => {
  if (!props.webp) return null
  // If src already contains .webp, don't add it
  if (props.src.endsWith('.webp')) return null
  // Replace extension with .webp
  return props.src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
})

const onLoad = (event: Event) => {
  emit('load', event)
}

const onError = (event: Event) => {
  emit('error', event)
}
</script>

