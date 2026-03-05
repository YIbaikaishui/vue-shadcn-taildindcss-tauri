<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVModel } from '@vueuse/core'
import { cn } from '@/lib/utils'
import type { ClassValue } from 'clsx'

import { Eye, EyeOff } from 'lucide-vue-next'

defineOptions({
  inheritAttrs: false,
})

const props = defineProps<{
  type?: string
  defaultValue?: string | number
  modelValue?: string | number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', payload: string | number): void
}>()

const modelValue = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: props.defaultValue,
})

const visible = ref(false)

const inputType = computed(() =>
  props.type === 'password' ? (visible.value ? 'text' : 'password') : (props.type ?? 'text')
)
</script>

<template>
  <div v-if="props.type === 'password'" class="relative">
    <input
      v-model="modelValue"
      v-bind="$attrs"
      :type="inputType"
      data-slot="input"
      :class="
        cn(
          'pr-10 backdrop-blur-[2px]',
          'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
          'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          $attrs.class as ClassValue
        )
      "
    />

    <button
      type="button"
      tabindex="-1"
      @mousedown.prevent
      @click="visible = !visible"
      :aria-label="visible ? 'Hide password' : 'Show password'"
      class="absolute inset-y-0 right-2 flex items-center text-sm text-muted-foreground hover:text-foreground"
    >
      <Eye v-if="visible" />
      <EyeOff v-else />
    </button>
  </div>

  <input
    v-else
    v-model="modelValue"
    v-bind="$attrs"
    :type="props.type ?? 'text'"
    data-slot="input"
    :class="
      cn(
        'backdrop-blur-[2px]',
        'h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none',
        'selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground',
        'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        $attrs.class as ClassValue
      )
    "
  />
</template>
