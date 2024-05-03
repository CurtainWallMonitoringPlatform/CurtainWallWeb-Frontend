// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  extends: [process.env.NUXT_UI_PRO_PATH || '@nuxt/ui-pro'],
  modules: ['@nuxt/ui', '@nuxt/fonts', '@vueuse/nuxt', "@nuxt/image", '@element-plus/nuxt','@pinia/nuxt', '@nuxtjs/google-fonts'],
  googleFonts: {
    families: {
        'Noto Sans SC': [200, 400, 600, 800],  // 中文无衬线字体
        'Noto Serif SC': true , // 中文衬线体
        // 更多字体到 https://fonts.google.com/?noto.script=Hans 这里查看，各种语言字体都有，而且全部免费商用
    }
  },
  ui: {
    icons: ['heroicons', 'simple-icons'],
    safelistColors: ['primary', 'red', 'orange', 'green']
  },
  devtools: { enabled: true }
})
