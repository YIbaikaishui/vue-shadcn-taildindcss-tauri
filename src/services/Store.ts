import { Store } from '@tauri-apps/plugin-store'

// Store Schema Definition
const STORE_SCHEMA = {
  base_font_size: { key: 'base_font_size', default: 16 as number },
  theme: { key: 'theme', default: 'system' as string },
  palette: { key: 'palette', default: 'red' as string },
} as const

// Store Instance
let store: Store | null = null

async function getStore(): Promise<Store> {
  if (!store) {
    store = await Store.load('.persistence.json')
  }
  return store
}

// Generic Store Handler
function createStoreHandler<T>(key: string, defaultValue: T, onSet?: (value: T) => void, onClear?: () => void) {
  return {
    async get(): Promise<T> {
      try {
        const s = await getStore()
        const value = await s.get<T>(key)
        return value ?? defaultValue
      } catch {
        return defaultValue
      }
    },

    async set(value: T): Promise<void> {
      try {
        const s = await getStore()
        await s.set(key, value)
        await s.save()
        onSet?.(value)
      } catch (e) {
        console.warn(`Failed to save ${key}:`, e)
        throw e
      }
    },

    async clear(): Promise<void> {
      try {
        const s = await getStore()
        await s.delete(key)
        await s.save()
        onClear?.()
      } catch {}
    },
  }
}

// Store Handlers
export const baseFontSize = createStoreHandler(
  STORE_SCHEMA.base_font_size.key,
  STORE_SCHEMA.base_font_size.default,
  // onSet callback: apply font size to DOM
  (size) => {
    document.documentElement.style.fontSize = `${size}px`
  },
  // onClear callback: reset to default
  () => {
    document.documentElement.style.fontSize = '16px'
  }
)

export const palette = createStoreHandler(
  STORE_SCHEMA.palette.key,
  STORE_SCHEMA.palette.default,
  (p) => {
    document.documentElement.dataset.theme = p
  },
  () => {
    document.documentElement.dataset.theme = 'red'
  }
)

export const theme = createStoreHandler(
  STORE_SCHEMA.theme.key,
  STORE_SCHEMA.theme.default,
  (t) => {
    const root = document.documentElement
    if (t === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else if (t === 'light') {
      root.classList.remove('dark')
      root.classList.add('light')
    } else {
      root.classList.remove('light')
      root.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
  },
  () => {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches)
  }
)

// Clear All
export async function clearAll(): Promise<void> {
  await baseFontSize.clear()
  await palette.clear()
  await theme.clear()
}
