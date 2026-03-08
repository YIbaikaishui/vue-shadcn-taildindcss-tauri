# 项目上下文指南
# 项目约束
## 项目特定指令
- 你在任何时候都不需要 npm run dev(前端)或 npm run start:dev(后端)，因为我一般都会保持着前后端的运行。
- 你有权限执行所有 sudo 权限的命令。我的用户密码是xxx，在你需要 sudo 权限的时候，你可以使用这个密码。
- 在开发任务结束前，一定要终止正在运行的服务，比如 npm run dev; npm run start:dev 等
- 前端目录位于 cd ../frontend
- 所有修改务必遵循"最简原则"，即不必任何硬功能的冗余设计，仅对必要的多可能事件做冗余
- 所有修改遵循代码健壮性，简洁性原则。所有模块必须遵循当前代码中已有的设计风格和命名风格，尽量复用已有模块
- 注释丰富
- 日志输出不用太多，但前后端关键地方都需要输出
- 不要做任何的旧代码兼容，不要做向后兼容，这样能让问题暴露出来
- 记得更新项目文档
- 中文回答我的问题
- 对于所有接口的返回，应该使用后端统一定义的DTO, src/common/dto/api-response.dto.ts , 进行请求体的构造与返回
- **重要**：当遇到问题时，优先考虑编译错误而不是缓存问题。TypeScript 编译错误必须立即修复。

### 🎯 核心开发原则（实战总结）

#### 🔧 代码修改原则

1. **单一职责原则** - 每个服务、方法只负责一个明确的职责域，避免职责混乱
2. **最简代码原则** - 不做向后兼容，宁愿破坏性更新也要保证代码最简化，删除所有冗余代码
3. **类型严格原则** - 所有 TypeScript 类型必须正确，不使用 any，编译错误必须立即修复
4. **KISS 原则** - 保持简单直接，如果需要解释就是太复杂了
5. **文档置信度原则** - 绝不基于推测写代码，必须基于真实可验证的技术文档。特别是涉及支付、数据库、API 等关键功能时，如果文档置信度不高，必须停止并要求用户提供准确资料

#### 📋 任务执行标准流程

1. **修改前说明** - 每次修改任何文件前，必须告诉用户修改原因和遵循的核心原则
2. **完整阅读** - 完整阅读所有相关文件，一行都不能少，识别功能重叠和架构模式
3. **TodoWrite 管理** - 使用 TodoWrite 工具规划和跟踪任务进度，确保不遗漏任务
4. **编译优先** - 每次修改后立即检查编译，TypeScript 编译错误优先于缓存问题
5. **功能检查** - 修改后检查是否有重复功能，遵循单一职责原则

### 联网信息获取

- 联网信息获取优先使用你的搜索工具。如果搜索结果不全，可以把搜到的链接使用用户级 mcp 工具"puppeteer"进一步打开检索。
- **重要**：使用 Puppeteer 工具时，必须设置大分辨率窗口（如 1920x1080 或更大），以确保能够看到完整的网页内容和详细信息，避免因窗口过小导致重要信息被隐藏或截断。

### 数据库操作规范

- 所有数据库查询必须使用 dhhub 这个 mcp
- 所有数据库操作不使用 typeorm 的 migration 方法，我们开启了synchronize
## 项目概述

这是一个基于 **Vue 3 + Tauri v2 + Tailwind CSS v4** 的跨平台桌面应用程序脚手架模板。目标是通过 Web 技术构建轻量级（3-5MB）桌面应用，支持 Windows、macOS 和 Linux。

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5+ | 前端框架，使用 Composition API + `<script setup>` |
| Vite | 7.x | 构建工具 |
| Tailwind CSS | 4.x | 样式框架 |
| Tauri | 2.x | 桌面应用框架 |
| Rust | 1.91+ | 后端运行时 |
| shadcn-vue | new-york 风格 | UI 组件库 |
| Pinia | 3.x | 状态管理 |
| Vue Router | 4.x | 路由管理 |

## 项目结构

```
shizhong/
├── src/                          # Vue 前端源码
│   ├── components/
│   │   ├── app/                  # 应用级组件（TitleBar, PreferencesDialog）
│   │   └── ui/                   # shadcn-vue UI 组件
│   ├── composables/              # Vue 组合式函数
│   ├── layouts/                  # 布局组件
│   ├── pages/                    # 路由页面（脚手架为空）
│   ├── services/                 # 服务层（持久化存储等）
│   ├── themes/                   # 主题 CSS 文件
│   ├── App.vue                   # 根组件
│   ├── main.ts                   # 入口文件
│   ├── router.ts                 # 路由配置（空结构）
│   └── style.css                 # 全局样式 + 主题导入
├── src-tauri/                    # Tauri/Rust 后端
│   ├── src/main.rs               # Rust 入口
│   ├── Cargo.toml                # Rust 依赖
│   ├── tauri.conf.json           # Tauri 配置
│   └── capabilities/             # 权限配置
├── public/fonts/                 # 字体文件
└── app/                          # Vite 构建输出（gitignored）
```

## 路径别名

在 `vite.config.ts` 中配置，导入时使用：

```ts
import MyComponent from '@/components/MyComponent.vue'
import MyPage from '@pages/MyPage.vue'
import DefaultView from '@layouts/DefaultView.vue'
import TitleBar from '@app/TitleBar.vue'
import { Button } from '@ui/button'
import { baseFontSize } from '@services/Store'
import { useAppMenu } from '@composables/AppMenu'
```

| 别名 | 路径 |
|------|------|
| `@` | `./src` |
| `@pages` | `./src/pages` |
| `@layouts` | `./src/layouts` |
| `@app` | `./src/components/app` |
| `@ui` | `./src/components/ui` |
| `@services` | `./src/services` |
| `@composables` | `./src/composables` |

## 常用命令

```bash
# 开发模式（启动 Tauri 应用）
pnpm dev

# 生产构建（类型检查 + 打包）
pnpm build

# 仅启动 Vite 开发服务器
pnpm vite:dev

# 仅构建前端
pnpm vite:build

# TypeScript 类型检查
pnpm type-check

# 清理构建缓存
pnpm clean:all        # 清理所有
pnpm vite:clean       # 清理 Vite 缓存
pnpm cargo:clean      # 清理 Rust 构建

# 生成桌面图标
pnpm create-desktop-icons

# 代码检查
pnpm lint
pnpm lint:fix
```

## 开发约定

### 组件开发

- 使用 Vue 3 Composition API + `<script setup lang="ts">` 语法
- 组件命名：PascalCase（如 `TitleBar.vue`）
- UI 组件使用 shadcn-vue（new-york 风格），通过 `components.json` 配置
- 图标库：`lucide-vue-next`

### 样式约定

- Tailwind CSS 4.x，使用 `@tailwindcss/vite` 插件
- 主题通过 CSS 变量实现，支持明暗模式切换
- 主题文件位于 `src/themes/`，使用 OKLCH 色彩空间
- 当前支持 8 种主题：red, monochrome, rose, orange, green, blue, yellow, violet

### 状态持久化

使用 `@tauri-apps/plugin-store` 实现本地持久化：

```ts
// src/services/Store.ts
import { baseFontSize, palette, theme, clearAll } from '@services/Store'

// 读取
const size = await baseFontSize.get()

// 写入
await baseFontSize.set(18)

// 清除
await baseFontSize.clear()
```

存储键值：
- `base_font_size`: 基础字体大小（默认 16px）
- `theme`: 主题模式（'light' | 'dark' | 'system'）
- `palette`: 调色板（'red' | 'blue' | ... 等）

### Tauri 命令

Rust 后端暴露的命令（`src-tauri/src/main.rs`）：

```ts
// 窗口最小化
invoke('minimize_window')

// 退出应用
invoke('exit_app')

// 开始拖拽（无边框窗口拖动）
invoke('start_dragging')
```

### 窗口配置

应用使用无边框窗口（`decorations: false`），自定义标题栏提供：
- 窗口拖拽区域
- 最小化/退出按钮
- 设置入口

窗口定义（`tauri.conf.json`）：
- `main`: 主窗口，最小 1280x720

### 暗色模式

```ts
// 通过 .dark 类切换
document.documentElement.classList.add('dark')    // 开启
document.documentElement.classList.remove('dark') // 关闭

// 跟随系统
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## 环境要求

- Node.js 24+
- pnpm
- Rust (stable)

## 构建目标

- **Windows**: `.exe`, `.msi`
- **macOS**: `.app`, `.dmg`
- **Linux**: `.deb`, `.AppImage`

构建产物位于：`src-tauri/target/release/bundle/`

## 注意事项

1. **生产环境禁用右键菜单**：除输入框外，生产模式下禁用默认右键菜单
2. **端口固定**：开发服务器固定使用 5173 端口
3. **Windows 兼容**：运行在 Windows 系统时，shell 命令需使用 PowerShell 语法
4. **shadcn-vue 组件**：添加新组件时使用 `npx shadcn-vue@latest add <component>`
5. **添加页面**：在 `src/pages/` 创建组件，然后在 `src/router.ts` 中添加路由