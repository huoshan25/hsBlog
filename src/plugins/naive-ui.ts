import { setup } from '@css-render/vue3-ssr'
import { defineNuxtPlugin } from 'nuxt/app'

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const { collect } = setup(nuxtApp.vueApp)
    const originalRenderMeta = nuxtApp.ssrContext?.renderMeta

    if (nuxtApp.ssrContext) {
      nuxtApp.ssrContext.renderMeta = () => {
        if (!originalRenderMeta) {
          return {
            headTags: collect()
          }
        }

        const meta = typeof originalRenderMeta === 'function'
          ? originalRenderMeta()
          : originalRenderMeta

        return {
          ...meta,
          headTags: collect() + (meta?.headTags || '')
        }
      }
    }
  }

  return {
    provide: {}
  }
})