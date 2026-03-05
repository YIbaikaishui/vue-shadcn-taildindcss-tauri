import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from '@/App.vue'
import router from '@/router'
import '@/style.css'

import { theme, palette } from '@services/Store'

const pinia = createPinia()

const media = window.matchMedia('(prefers-color-scheme: dark)')

const applyModeFromSystem = () => {
  document.documentElement.classList.toggle('dark', media.matches)
}

function shouldAllowCustomContextMenu(target: EventTarget | null) {
  const el = target instanceof Element ? target : null
  return !!el?.closest('[data-slot="context-menu-trigger"]')
}

function isEditableTarget(target: EventTarget | null) {
  const el = target instanceof Element ? target : null
  return !!el?.closest('input, textarea, [contenteditable="true"], [contenteditable=""], [role="textbox"]')
}

if (import.meta.env.PROD) {
  document.addEventListener(
    'contextmenu',
    (e) => {
      if (isEditableTarget(e.target)) return
      if (shouldAllowCustomContextMenu(e.target)) return
      e.preventDefault()
    },
    { capture: true }
  )
}

;(async () => {
  try {
    document.documentElement.dataset.theme = await palette.get()

    const savedTheme = await theme.get()
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark')
    } else {
      // 'system' or no saved value — follow OS
      applyModeFromSystem()
      media.addEventListener('change', applyModeFromSystem)
    }
  } catch {
    document.documentElement.dataset.theme = 'red'
    applyModeFromSystem()
    media.addEventListener('change', applyModeFromSystem)
  }

  createApp(App).use(router).use(pinia).mount('#app')
})()
