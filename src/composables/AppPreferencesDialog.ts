import { ref } from 'vue'

const preferencesOpen = ref(false)

export function usePreferencesDialog() {
  const openSettings = () => (preferencesOpen.value = true)
  const closeSettings = () => (preferencesOpen.value = false)
  const toggleSettings = () => (preferencesOpen.value = !preferencesOpen.value)

  return { preferencesOpen, openSettings, closeSettings, toggleSettings }
}
