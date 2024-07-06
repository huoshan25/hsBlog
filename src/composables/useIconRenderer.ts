import { h } from 'vue'
import type {FunctionalComponent} from "vue";

/**
 * 图标信息的类型
 * @interface ImgOptions
 */
export interface ImgOptions {
  src: string
  alt?: string
  style?: string
}

/**
 * 渲染图标函数的类型定义
 */
type RenderImgFunction = (img: ImgOptions) => FunctionalComponent

/**
 * 用于生成图标渲染函数
 * @returns 包含 renderImg 函数的对象
 */
const useIconRenderer = (): { renderImg: RenderImgFunction } => {
  /**
   * 渲染图标函数
   */
  const renderImg: RenderImgFunction = (img) => {

    const imgUrl = require('@/assets/svg/' + img.src);
    return () => h('img', null, {
      src: imgUrl,
      alt: img.alt || '',
      style: img.style || ''
    })
  }

  return {
    renderImg
  }
}

export default useIconRenderer
