import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  // 自定义类名
  shortcuts: [
    ['btn', 'px-4 py-1 rounded inline-block bg-teal-600 text-white cursor-pointer hover:bg-teal-700 disabled:cursor-default disabled:bg-gray-600 disabled:opacity-50'],
    ['icon-btn', 'inline-block cursor-pointer select-none opacity-75 transition duration-200 ease-in-out hover:opacity-100 hover:text-teal-600'],
  ],
  presets: [
    presetUno(), //UnoCSS的默认预设，提供了一组实用的CSS类。
    presetAttributify(), //启用属性化模式，可以使用类似<div text="center" p="4">的语法。
    presetIcons({ //启用图标预设，并将图标默认缩放为1.2倍。
      scale: 1.2,
    }),
    presetTypography(), //为文本提供排版样式。
    presetWebFonts({ //为项目引入自定义网络字体。
      fonts: {
        // sans: 'DM Sans',
        // serif: 'DM Serif Display',
        // mono: 'DM Mono',
      },
    }),
  ],
  transformers: [ //转换器用于处理特殊的CSS语法：
    transformerDirectives(), //支持类似@apply指令的语法，便于在CSS中应用多个实用类
    transformerVariantGroup(), //支持变体分组语法，可以将多个变体组合在一起使用。
  ],
})
