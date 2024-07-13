
import { useState } from "nuxt/app";


/**
 * 主题颜色
 */
export const useThemeColor = () => {
  const themeColor = useState<string>('themeColor', () => '#409eff')
  return {
    themeColor
  }
}