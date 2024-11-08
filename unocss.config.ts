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

import type {Rule} from 'unocss'
import {presetRemToPx} from '@unocss/preset-rem-to-px'

export default defineConfig({
  rules: [
    [
      /^custom-border(?:-(.+))?-(.+)$/,
      ([, direction, value]) => {
        const parts = value.split('_');
        const width = parts[0] || '1px';
        const style = parts[1] || 'solid';
        const color = parts[2] || 'currentColor';
        const borderValue = `${width} ${style} ${color.replace(/-/g, ',')}`;

        if (!direction) {
          return {'border': borderValue};
        }

        const sides = direction.split('-');
        const result: Record<string, string> = {};
        sides.forEach(side => {
          if (['top', 'right', 'bottom', 'left'].includes(side)) {
            result[`border-${side}`] = borderValue;
          }
        });
        return result;
      }
    ],
    [
      /^border-radius-(\d+)-(\d+)-(\d+)-(\d+)$/,
      ([, t, r, b, l]) => ({
        'border-radius': `${t}px ${r}px ${b}px ${l}px`
      })
    ]
  ],
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
    presetRemToPx({
      baseFontSize: 4, //unocss计算：1单位 = 0.25rem = 1px
    }) as any,
  ],
  transformers: [ //转换器用于处理特殊的CSS语法：
    transformerDirectives(), //支持类似@apply指令的语法，便于在CSS中应用多个实用类
    transformerVariantGroup(), //支持变体分组语法，可以将多个变体组合在一起使用。
  ],
})
