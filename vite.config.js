import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

// H5 构建配置：产出相对路径资源，便于打包后直接放到任意目录/本地打开
export default defineConfig({
  plugins: [uni()],
  base: './',
  build: {
    // 让所有图片等小资源内联成 base64，避免额外文件依赖
    assetsInlineLimit: 1024 * 1024 * 64,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // 打成单个 chunk，方便后续内联成一个 HTML 文件
        inlineDynamicImports: true,
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
