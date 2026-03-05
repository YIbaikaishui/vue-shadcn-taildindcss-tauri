<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import AppTitleBar from '@app/TitleBar.vue'

const route = useRoute()

const pageTitle = computed(() => {
  const t = route.meta.title
  return typeof t === 'string' ? t : ''
})
</script>

<template>
  <main class="relative flex h-full w-full flex-col">
    <AppTitleBar class="shrink-0">
      {{ pageTitle }}
    </AppTitleBar>
    <div class="flex-1 overflow-auto"><router-view /></div>
  </main>
</template>
