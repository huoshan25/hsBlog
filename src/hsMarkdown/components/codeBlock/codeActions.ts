export const copyToClipboard = `
  function copyCode(button) {
    const pre = button.closest('.code-card').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = '复制成功';
      window.showCopySuccess('已经复制到剪贴板');
      setTimeout(() => {
        button.textContent = '复制代码';
      }, 2000);
    });
  }
`

export const toggleCode = `
  function toggleCode(button) {
    const card = button.closest('.code-card');
    const pre = card.querySelector('pre');
    const arrow = button.querySelector('.arrow-icon');
    const isCollapsed = pre.style.display === 'none';
    
    pre.style.display = isCollapsed ? 'block' : 'none';
    arrow.style.transform = isCollapsed ? '' : 'rotate(180deg)';
    
    // 同时更新 aria-expanded 状态，提高可访问性
    button.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
  }
`