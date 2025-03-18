/**
 * 移除全局选择器下的margin和padding设置
 * @description 因为302的知识库插件会在页面加载时自动添加一些样式，这些样式会影响到项目ui，所以我们需要移除这些样式
 */
const removeGlobalMarginPadding = () => {
  // 遍历所有样式表
  for (let i = 0; i < document.styleSheets.length; i++) {
    try {
      const styleSheet = document.styleSheets[i];
      const rules = styleSheet.cssRules || styleSheet.rules;

      if (!rules) continue; // 跳过无法访问的样式表

      // 遍历样式规则
      for (let j = 0; j < rules.length; j++) {
        const rule = rules[j];

        // 只处理通配符选择器
        if (rule instanceof CSSStyleRule && rule.selectorText === "*") {
          // 移除margin和padding设置
          rule.style.removeProperty("margin");
          rule.style.removeProperty("padding");
          console.log("已移除全局选择器下的margin和padding设置");
        }
      }
    } catch (e) {
      console.log("无法访问样式表:", e);
    }
  }
};

export { removeGlobalMarginPadding };
