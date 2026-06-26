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
    'assets/img_a7a65b2d4c35.png': 'u_{AM}(t)=10(1+0.3\\cos2\\pi\\times10^3t)\\cos2\\pi\\times10^6t',
    'assets/img_f0654e96376a.jpg': '\\omega_L=\\omega_0',
    'assets/img_03877ddcd255.jpg': '\\varphi_e(t)=\\varphi_{e\\infty}',
    'assets/img_f3b932d6ba8d.jpg': '\\varphi_e(t)=0',
    'assets/img_60447fd57e2b.jpg': '\\Delta\\omega=\\Delta\\omega_L',
    'assets/img_d035fb613b12.png': 'u_s(t)=U_s\\cos\\omega_s t\\cos\\Omega t'
  };

  let typesetTimer = 0;
  let typesetChain = Promise.resolve();

  sanitizeQuestionTexts();
  injectMathStyles();
  overrideMarkdownRenderer();
  wrapRenderFunctions();

  document.addEventListener('DOMContentLoaded', () => {
    typesetMathSoon();
  });

  function sanitizeQuestionTexts() {
    const questions = window.CE_QUESTIONS || [];
    questions.forEach((q) => {
      if (q && q.explanation && typeof q.explanation.text === 'string') {
        q.explanation.text = cleanExplanationText(q.explanation.text, q);
      }
    });
  }

  function cleanExplanationText(text, q) {
    const images = Array.isArray(q.images) ? q.images : [];
    let imageCursor = 0;
    let removedImageSection = false;
    let imageSectionNumber = 3;
    let skippingImageSection = false;
    const cleanedLines = [];

    String(text || '')
      .replace(/\n+\s*---\s*$/g, '')
      .split(/\n/)
      .forEach((line) => {
        const imageHeader = line.match(/^\s*(\d+)\.\s*图片\/公式\/电路图信息：?\s*$/);
        if (imageHeader) {
          removedImageSection = true;
          imageSectionNumber = Number(imageHeader[1]) || 3;
          skippingImageSection = true;
          return;
        }
        if (skippingImageSection) {
          if (/^\s*\d+\.\s+/.test(line)) {
            skippingImageSection = false;
            cleanedLines.push(renumberLine(line, imageSectionNumber));
          }
          return;
        }
        if (/题库提取_assets\//.test(line) || /已检查，可见，尺寸/.test(line)) {
          removedImageSection = true;
          return;
        }
        cleanedLines.push(removedImageSection ? renumberLine(line, imageSectionNumber) : line);
      });

    return cleanedLines
      .join('\n')
      .replace(/`?题库提取_assets\/[^`\s，。；：)]+`?/g, '题图')
      .replace(/已检查，可见，尺寸\s*\d+×\d+，?/g, '')
      .replace(/\[图\/公式\]/g, () => {
        const img = images[imageCursor++];
        const formula = img && FORMULA_IMAGE_LATEX[normalizeSrc(img.src || img)];
        return formula ? `$${formula}$` : '题图';
      })
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  function renumberLine(line, removedNumber) {
    return line.replace(/^(\s*)(\d+)(\.\s+)/, (_, prefix, num, suffix) => {
      const n = Number(num);
      return prefix + (n > removedNumber ? n - 1 : n) + suffix;
    });
  }

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
    if (formula) return `<span class="formula-converted"><span class="formula-latex">$${formula}$</span></span>`;
    return `<img class="md-img" src="${escapeAttrLocal(src)}" alt="${escapeAttrLocal(alt || '题目图片/公式')}" loading="lazy">`;
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
      .formula-converted { display: inline-flex; align-items: center; flex-wrap: wrap; vertical-align: middle; }
      .formula-latex { display: inline-block; vertical-align: middle; }
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
