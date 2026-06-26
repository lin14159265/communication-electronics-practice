(function () {
  const FORMULA_IMAGE_LATEX = {
    'assets/img_74e037847591.jpg': 'm_a \\le',
    'assets/img_a565c0e21bc5.png': 'm_a \\le \\frac{Z_L(\\Omega)}{Z_L(0)}',
    'assets/img_c43562aa1026.jpg': 'm_a \\le 1',
    'assets/img_7348ab4aa45f.jpg': 'm_a=1',
    'assets/img_94c1a77915a1.jpg': 'U_{\\Omega}',
    'assets/img_07682c896597.jpg': 'u_{\\Omega}(t)',
    'assets/img_c8649cfbd607.jpg': '\\int u_{\\Omega}(t)\\,dt',
    'assets/img_744cb4bb6177.jpg': '\\frac{1}{2}m_f',
    'assets/img_d60686dfee75.jpg': '\\frac{1}{4}m_f',
    'assets/img_f5b0037a9c55.jpg': '\\frac{1}{8}m_f',
    'assets/img_c3afb3374f26.png': 'u_c=U_{cm}\\sin(16\\times10^5\\pi t)',
    'assets/img_96c04249bd85.png': 'u_{FM}(t)=5\\cos(2\\pi\\times10^7t+25\\sin6\\pi\\times10^3t)',
    'assets/img_f5e41cb4a5e2.png': '\\Delta f_m',
    'assets/img_6b4a052781a1.png': 'm_f',
    'assets/img_af4b9bfc4542.png': 'u_{AM}(t)=50(1+0.5\\cos 2\\pi\\times10^2t)\\cos 2\\pi\\times10^6t',
    'assets/img_8c37551e36ca.png': 'u_{\\Omega}(t)=U_{\\Omega m}\\cos\\Omega t',
    'assets/img_d7263ffc61d5.png': 'u_c(t)=U_{cm}\\cos\\omega_ct',
    'assets/img_f7f2ab311a49.png': 'u_c(t)=2\\cos4\\pi\\times10^6t\\;(V)',
    'assets/img_18a1e87de339.png': 'u_L=0.15(1+0.3\\cos2\\pi\\times10^3t)\\cos2\\pi\\times10^6t\\;(V)',
    'assets/img_a7a65b2d4c35.png': 'u_{AM}(t)=10(1+0.3\\cos2\\pi\\times10^3t)\\cos2\\pi\\times10^6t'
  };

  let typesetTimer = 0;
  let typesetChain = Promise.resolve();

  injectMathStyles();
  overrideMarkdownRenderer();
  wrapRenderFunctions();

  document.addEventListener('DOMContentLoaded', () => {
    typesetMathSoon();
    document.body.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-toggle-original]');
      if (!btn) return;
      const box = btn.closest('.formula-converted');
      const original = box && box.querySelector('.formula-original');
      if (!original) return;
      const show = original.hidden;
      original.hidden = !show;
      btn.textContent = show ? '隐藏原图' : '查看原图';
      typesetMathSoon();
    });
  });

  function overrideMarkdownRenderer() {
    window.renderMarkdown = function renderMarkdownWithLatex(md) {
      if (!md) return '';
      let html = escapeHTMLLocal(md);
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => renderImageOrFormula(alt, src));
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/`([^`]+)`/g, '<span class="kbd">$1</span>');
      html = html.replace(/\n/g, '<br>');
      return html;
    };
    window.renderMarkdownInline = function renderMarkdownInlineWithLatex(s) {
      return window.renderMarkdown(String(s || '')).replace(/<br>/g, ' ');
    };
  }

  function renderImageOrFormula(alt, rawSrc) {
    const src = normalizeSrc(rawSrc);
    const formula = FORMULA_IMAGE_LATEX[src];
    const originalImg = `<img class="md-img" src="${escapeAttrLocal(src)}" alt="${escapeAttrLocal(alt || '题目图片/公式')}" loading="lazy">`;
    if (!formula) return originalImg;
    return `<span class="formula-converted"><span class="formula-latex">$${formula}$</span><button type="button" class="formula-original-btn" data-toggle-original="1">查看原图</button><span class="formula-original" hidden>${originalImg}</span></span>`;
  }

  function normalizeSrc(src) {
    return String(src || '').replace(/^\.\//, '').trim();
  }

  function wrapRenderFunctions() {
    wrapGlobalFunction('renderQuestion');
    wrapGlobalFunction('renderStatsPage');
    wrapGlobalFunction('showView');
  }

  function wrapGlobalFunction(name) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function wrappedRenderFunction(...args) {
      const result = original.apply(this, args);
      typesetMathSoon();
      return result;
    };
  }

  function typesetMathSoon() {
    clearTimeout(typesetTimer);
    typesetTimer = setTimeout(() => {
      if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return;
      const scope = document.querySelector('.app-shell') || document.body;
      typesetChain = typesetChain
        .then(() => window.MathJax.typesetPromise([scope]))
        .catch((err) => console.warn('MathJax typeset failed:', err));
    }, 0);
  }

  function injectMathStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .formula-converted { display: inline-flex; align-items: center; gap: 6px; flex-wrap: wrap; vertical-align: middle; }
      .formula-latex { display: inline-block; vertical-align: middle; }
      .formula-original-btn { border: 1px solid var(--border, #d7dce8); border-radius: 999px; background: var(--card, #fff); color: var(--muted, #667085); font-size: 12px; padding: 3px 8px; cursor: pointer; }
      .formula-original { display: inline-flex; align-items: center; padding: 3px 6px; border: 1px dashed var(--border, #d7dce8); border-radius: 8px; background: rgba(127,127,127,.06); }
      .formula-original[hidden] { display: none !important; }
      .mjx-container { overflow-x: auto; overflow-y: hidden; max-width: 100%; }
      .option .mjx-container { max-width: 100%; }
    `;
    document.head.appendChild(style);
  }

  function escapeHTMLLocal(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }
  function escapeAttrLocal(s) {
    return escapeHTMLLocal(s).replace(/`/g, '&#96;');
  }
})();
