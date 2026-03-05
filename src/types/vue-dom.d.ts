import 'vue'

declare module 'vue' {
  interface OptionHTMLAttributes {
    'data-slot'?: string
  }
  interface OptgroupHTMLAttributes {
    'data-slot'?: string
  }
}
