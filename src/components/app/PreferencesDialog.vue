<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { usePreferencesDialog } from '@/composables/AppPreferencesDialog'
import { useAppPreferences, type Theme, type Palette } from '@composables/AppPreferences'
import { Settings, Plus, Minus } from 'lucide-vue-next'
import { platform } from '@tauri-apps/plugin-os'

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@ui/tooltip'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@ui/alert-dialog'

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@ui/select'

import { Kbd, KbdGroup } from '@ui/kbd'

import { Button } from '@ui/button'
import { Label } from '@ui/label'

const { preferencesOpen, closeSettings, openSettings } = usePreferencesDialog()

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs'
    class?: string
  }>(),
  {
    variant: 'secondary',
    size: 'sm',
    class: '',
  }
)

const {
  theme: globalTheme,
  palette: globalThemePalette,
  fontSize: globalFontSize,
  saveAppPreferences,
} = useAppPreferences()

// Local state for preview
const theme = ref<Theme>('system')
const themePalette = ref<Palette>('red')
const fontSize = ref(16)
const isSaving = ref(false)

const hasChanges = computed(() => {
  return (
    fontSize.value !== globalFontSize.value ||
    theme.value !== globalTheme.value ||
    themePalette.value !== globalThemePalette.value
  )
})

// Font size presets
const MIN_FONT_SIZE = 14
const MAX_FONT_SIZE = 22
const DEFAULT_THEME = 'system' as const
const DEFAULT_THEME_PALETTE = 'red' as const
const DEFAULT_FONT_SIZE = 16

// Load from composable when dialog opens
watch(preferencesOpen, (isOpen) => {
  if (!isOpen) return
  fontSize.value = globalFontSize.value
  theme.value = globalTheme.value
  themePalette.value = globalThemePalette.value
})

const increaseFontSize = () => {
  if (fontSize.value < MAX_FONT_SIZE) {
    fontSize.value += 1
  }
}

const decreaseFontSize = () => {
  if (fontSize.value > MIN_FONT_SIZE) {
    fontSize.value -= 1
  }
}

const loadDefaults = () => {
  theme.value = DEFAULT_THEME
  themePalette.value = DEFAULT_THEME_PALETTE
  fontSize.value = DEFAULT_FONT_SIZE
}

const isAtDefaults = computed(
  () =>
    fontSize.value === DEFAULT_FONT_SIZE &&
    theme.value === DEFAULT_THEME &&
    themePalette.value === DEFAULT_THEME_PALETTE
)

const savePreferences = async () => {
  if (isSaving.value) return

  isSaving.value = true
  try {
    globalTheme.value = theme.value
    globalThemePalette.value = themePalette.value
    globalFontSize.value = fontSize.value

    await saveAppPreferences()

    preferencesOpen.value = false
  } catch (e) {
    console.error('Failed to save preferences:', e)
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <AlertDialog v-model:open="preferencesOpen">
    <AlertDialogTrigger as-child>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <Button :variant="variant" :size="size" tabindex="-1" :class="class" class="group" @click="openSettings">
              <Settings class="group-hover:animate-spin" style="animation-duration: 3s" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <span class="flex items-center gap-1">
              App Preferences
              <KbdGroup class="flex items-center">
                <Kbd v-if="platform() === 'macos'" class="rounded-lg border">⌘</Kbd>
                <Kbd v-else class="rounded-lg border">Ctrl</Kbd>
                <span>+</span>
                <Kbd class="rounded-lg border">,</Kbd>
              </KbdGroup>
            </span>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle class="flex items-center gap-2">
          <Settings class="size-5" />
          App Preferences
          <Button
            type="Button"
            size="sm"
            variant="outline"
            class="ms-auto flex items-center gap-1 px-1"
            @click="closeSettings"
          >
            <span class="pt-1"> Close </span>
            <KbdGroup class="flex items-center">
              <Kbd class="border">Esc</Kbd>
            </KbdGroup>
          </Button>
        </AlertDialogTitle>
        <AlertDialogDescription> Configure application settings and preferences. </AlertDialogDescription>
      </AlertDialogHeader>

      <form id="dialogForm" class="space-y-4" @submit.prevent="savePreferences">
        <!-- Theme (light/dark/system) -->
        <div class="flex items-center justify-between">
          <Label class="text-sm font-medium">Theme</Label>

          <Select v-model="theme">
            <SelectTrigger class="w-50">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Appearance</SelectLabel>
                <SelectItem value="system">System (Default)</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Theme Palette -->
        <div class="flex items-center justify-between">
          <Label class="text-sm font-medium">Theme Palette</Label>

          <Select v-model="themePalette">
            <SelectTrigger class="w-50">
              <SelectValue placeholder="Select palette" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Color schemes</SelectLabel>
                <SelectItem value="red">Red (Default)</SelectItem>
                <SelectItem value="monochrome">Monochrome</SelectItem>
                <SelectItem value="rose">Rose</SelectItem>
                <SelectItem value="orange">Orange</SelectItem>
                <SelectItem value="green">Green</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="yellow">Yellow</SelectItem>
                <SelectItem value="violet">Violet</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <!-- Font Size Control -->
        <div class="flex items-center justify-between">
          <Label class="text-sm font-medium">Text Size</Label>

          <div class="flex items-center justify-center rounded-lg border">
            <Button
              type="button"
              variant="secondary"
              size="xs"
              class="rounded-none border-r"
              :disabled="fontSize <= MIN_FONT_SIZE"
              @click="decreaseFontSize"
            >
              <Minus :size="16" />
            </Button>

            <div class="w-16 text-center">{{ fontSize }}</div>

            <Button
              type="button"
              variant="secondary"
              size="xs"
              class="rounded-none border-l"
              :disabled="fontSize >= MAX_FONT_SIZE"
              @click="increaseFontSize"
            >
              <Plus :size="16" />
            </Button>
          </div>
        </div>

        <!-- Preview Text -->
        <div class="rounded-lg border p-4 text-center">
          <p :style="{ fontSize: `${fontSize}px` }" class="font-medium">Preview Text</p>
          <p :style="{ fontSize: `${fontSize * 0.875}px` }" class="mt-1 text-muted-foreground">
            This is how your text will look
          </p>
        </div>
      </form>

      <AlertDialogFooter>
        <Button type="button" variant="outline" size="sm" @click="loadDefaults" :disabled="isAtDefaults">
          Load Defaults
        </Button>

        <AlertDialogAction size="sm" :disabled="!hasChanges || isSaving" @click="savePreferences">
          {{ isSaving ? 'Saving...' : 'Save and close' }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
