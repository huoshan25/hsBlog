/**
 * useScrollListener.ts
 *
 * 该模块提供了一个自定义Hook，用于监听元素的滚动事件，并在滚动到顶部、底部或任意时刻触发回调。
 * 用户可以通过传递一个元素引用和一个配置对象来自定义滚动行为。
 */

import { onMounted, onUnmounted, ref, nextTick } from 'vue';
import type { Ref } from 'vue';

/**ScrollOptions 接口定义了传递给 useScrollListener 的可选回调函数*/
interface ScrollOptions {
  /**当页面滚动到视口底部时调用的回调函数*/
  onReachBottom?: () => void;
  /**当滚动到顶部时调用的回调函数*/
  onReachTop?: () => void;
  /**滚动过程中持续触发的回调函数，接收当前滚动事件和滚动位置作为参数*/
  onScroll?: (event: Event, currentPosition: number) => void;
}

/**
 * useScrollListener 是一个有关监听元素滚动的hook。
 *
 * @param elementRef - 用于获取需要监听滚动的DOM元素的引用。
 * @param options - 配置选项，包括触底、触顶及滚动过程中的回调。
 * @returns 返回包含滚动状态、当前位置以及内部处理滚动的函数的响应式对象。
 */
const useScrollListener = (elementRef: Ref<HTMLElement | null>, options: ScrollOptions = {}) => {
  // 是否发生了滚动的标志位。
  const isScrolled = ref(false);

  // 当前滚动位置。
  const currentPosition = ref(0);

  // 用于存储滚动事件的处理函数，以便在组件卸载时移除事件监听。
  let scrollHandler: EventListenerOrEventListenerObject | null = null;

  /**
   * handleScroll 是处理滚动事件的核心函数。
   * 它会更新滚动位置，调用滚动时的回调，并检查是否触底或触顶。
   */
  const handleScroll = (event: Event) => {
    const element = elementRef.value;
    if (!element) return;

    currentPosition.value = element.scrollTop;

    // 触发滚动时的回调（如果已提供）。
    options.onScroll?.(event, currentPosition.value);

    // 检查是否滚动到底部。
    if (element.scrollHeight - element.scrollTop === element.clientHeight) {
      options.onReachBottom?.();
    }

    // 检查是否滚动到顶部。
    if (element.scrollTop === 0) {
      options.onReachTop?.();
    }

    // 标记滚动状态为已滚动。
    isScrolled.value = true;
  };

  onMounted(async () => {
    await nextTick(); // 确保DOM已经更新。
    if (elementRef.value) {
      scrollHandler = handleScroll;
      elementRef.value.addEventListener('scroll', scrollHandler);
    }
  });

  onUnmounted(() => {
    if (elementRef.value && scrollHandler) {
      elementRef.value.removeEventListener('scroll', scrollHandler);
    }
  });

  return {
    isScrolled,
    currentPosition,
  };
};

export default useScrollListener;
