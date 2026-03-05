import { ref, watch } from 'vue'
import { baseFontSize, theme as themeStore, palette as paletteStore } from '@services/Store'

export type Theme = 'system' | 'light' | 'dark'
export type Palette = 'red' | 'monochrome' | 'rose' | 'orange' | 'green' | 'blue' | 'yellow' | 'violet'

const theme = ref<Theme>('system')
const palette = ref<Palette>('red')
const fontSize = ref(16)

watch(
  palette,
  (p) => {
    document.documentElement.dataset.theme = p
  },
  { immediate: true }
)

watch(
  theme,
  (t) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else if (t === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      // system: immediately apply current OS preference
      root.classList.remove('light')
      root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  },
  { immediate: true }
)

// Load initial values
export async function loadAppPreferences() {
  theme.value = (await themeStore.get()) as Theme
  palette.value = (await paletteStore.get()) as Palette
  fontSize.value = await baseFontSize.get()
}

// Save to store
export async function saveAppPreferences() {
  await themeStore.set(theme.value)
  await paletteStore.set(palette.value)
  await baseFontSize.set(fontSize.value)
}

export function useAppPreferences() {
  return { theme, palette, fontSize, loadAppPreferences, saveAppPreferences }
}

loadAppPreferences()
