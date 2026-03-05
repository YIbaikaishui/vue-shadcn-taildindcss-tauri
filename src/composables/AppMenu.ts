import { platform } from '@tauri-apps/plugin-os'
import { exit } from '@tauri-apps/plugin-process'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { Menu, Submenu, MenuItem, PredefinedMenuItem } from '@tauri-apps/api/menu'

import { WebviewWindow } from '@tauri-apps/api/webviewWindow'

import { usePreferencesDialog } from '@composables/AppPreferencesDialog'

let initPromise: Promise<void> | null = null
let menuRef: Menu | null = null

const { openSettings } = usePreferencesDialog()

async function openWindow(label: 'about' | 'docs') {
  const win = await WebviewWindow.getByLabel(label)
  await win?.show()
  await win?.setFocus()
}

export function useAppMenu() {
  async function init() {
    if (initPromise) return initPromise

    // macOS note: all items must be grouped under a submenu (top-level items are ignored)
    // and the first submenu is placed under the app's "About" menu slot by default.
    initPromise = (async () => {
      const os = platform()

      const appSubmenu = await Submenu.new({
        text: 'File',
        items: [
          await MenuItem.new({
            id: 'about',
            text: 'About',
            accelerator: 'CmdOrCtrl+Shift+I',
            action: () => void openWindow('about'),
          }),
          await MenuItem.new({
            id: 'settings',
            text: 'Settings',
            accelerator: 'CmdOrCtrl+,',
            action: () => void openSettings(),
          }),
          await MenuItem.new({
            id: 'quit',
            text: 'Quit',
            accelerator: 'CmdOrCtrl+Q',
            action: () => void exit(0),
          }),
        ],
      })

      const editSubmenu = await Submenu.new({
        text: 'Edit',
        items: [
          await PredefinedMenuItem.new({ item: 'Cut' }),
          await PredefinedMenuItem.new({ item: 'Copy' }),
          await PredefinedMenuItem.new({ item: 'Paste' }),
          await PredefinedMenuItem.new({ item: 'SelectAll' }),
        ],
      })

      const helpSubmenu = await Submenu.new({
        text: 'Help',
        items: [
          await MenuItem.new({
            id: 'docs',
            text: 'View Docs',
            accelerator: 'F1',
            action: () => void openWindow('docs'),
          }),
        ],
      })

      menuRef = await Menu.new({ items: [appSubmenu, editSubmenu, helpSubmenu] })

      if (os === 'macos') {
        await menuRef.setAsAppMenu()
      } else {
        await menuRef.setAsWindowMenu(getCurrentWindow())
      }
    })().catch((err) => {
      initPromise = null
      console.error('Menu init failed:', err)
      throw err
    })

    return initPromise
  }

  return { init }
}
