export const copyToClipboard = `
  function copyCode(button) {
    const pre = button.closest('.code-card').querySelector('pre');
    const code = pre.querySelector('code').innerText;
    navigator.clipboard.writeText(code).then(() => {
      button.textContent = '已复制';
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
    const isCollapsed = pre.style.display === 'none';
    pre.style.display = isCollapsed ? 'block' : 'none';
    button.innerHTML = isCollapsed ? '收起2' : '展开';
  }
`