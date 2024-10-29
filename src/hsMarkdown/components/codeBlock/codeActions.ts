export const copyCode = `
  function copyCode(button) {
    const pre = button.closest('.code-card').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(code)
        .then(() => {
          button.textContent = '复制成功';
          if (window.showCopySuccess) {
            window.showCopySuccess('已经复制到剪贴板');
          }
          setTimeout(() => {
            button.textContent = '复制代码';
          }, 2000);
        })
        .catch(() => {
          console.log('备选');
          fallbackCopy(code, button);
        });
    } else {
      fallbackCopy(code, button);
    }
  }

  function fallbackCopy(text, button) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      button.textContent = '复制成功';
      if (window.showCopySuccess) {
        window.showCopySuccess('已经复制到剪贴板');
      }
      setTimeout(() => {
        button.textContent = '复制代码';
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }

    document.body.removeChild(textArea);
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