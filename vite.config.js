import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// ビルド時に manifest.json の start_url・scope・アイコンパスをベースパスに合わせて書き換えるプラグイン
function pwaManifestPlugin(base) {
  return {
    name: 'pwa-manifest',
    closeBundle() {
      const outDir = path.resolve('dist')
      const manifestPath = path.join(outDir, 'manifest.json')
      if (!fs.existsSync(manifestPath)) return
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'))
      manifest.start_url = base
      manifest.scope = base
      manifest.icons = manifest.icons.map((icon) => ({
        ...icon,
        src: base + icon.src.replace(/^\//, ''),
      }))
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    },
  }
}

const base = process.env.VITE_BASE_PATH ?? '/'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), pwaManifestPlugin(base)],
  base,
})
