import pluginVue from 'eslint-plugin-vue'
import ts from 'typescript-eslint'
import js from '@eslint/js'
import globals from 'globals'

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  {
    files: ['**/*.{vue,ts,js}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        parser: '@typescript-eslint/parser',
        sourceType: 'module'
      }
    },
    rules: {
      // 自定义规则
      'vue/multi-word-component-names': 'off', // 如果你的组件名可以单个词
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  },
  {
    ignores: ['node_modules', 'dist', 'src-tauri'] // 忽略 Rust 后端目录
  }
)