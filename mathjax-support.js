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

  const STUDY_BANK = [
    ['石英晶体|晶体振荡器', '石英晶体可看成高 Q 值谐振元件，有串联谐振频率 $f_s$ 和并联谐振频率 $f_p$。在 $f=f_s$ 附近阻抗最小，近似纯阻性；在 $f_s<f<f_p$ 区间呈感性。', '易把 $f_s$ 点和 $f_s<f<f_p$ 区间混淆。'],
    ['小信号调谐放大器|谐振放大器|通频带|品质因数|选择性', '小信号谐振放大器可以理解为“放大器 + LC 选频网络”。中心频率 $f_0=\\frac{1}{2\\pi\\sqrt{LC}}$，通频带 $BW_{0.7}=\\frac{f_0}{Q_e}$。$Q_e$ 越大，带宽越窄，选择性越好。', '高 Q 是窄带、高选择性；低 Q 是宽带、低选择性。'],
    ['正弦波振荡|反馈型正弦波振荡器|振荡器|起振', '正弦波振荡器依靠放大器和正反馈网络补偿损耗。稳定振荡需满足相位平衡和振幅平衡：环路相移为 $2n\\pi$，环路增益约为 1。', '不要只看有没有反馈，还要看反馈是不是正反馈。'],
    ['丙类谐振功率放大器|高频功放|丙类|导通角', '丙类谐振功率放大器中晶体管导通角小于 $180^\\circ$，电流是脉冲；输出端 LC 谐振回路只选出所需频率，所以负载上仍可得到近似正弦波。', '电流脉冲失真不等于输出一定失真，因为谐振回路会选频。'],
    ['振幅调制|调幅系数|AM|普通调幅', '普通 AM 是让载波幅度随调制信号变化：$u_{AM}(t)=U_c(1+m_a\\cos\\Omega t)\\cos\\omega_c t$。频谱含载波 $f_c$ 和上下边频 $f_c\\pm F$；带宽约为 $2F_{max}$。', '角频率必须除以 $2\\pi$ 才是频率。外面的载波幅度不是调幅系数。'],
    ['二极管包络检波|包络检波|检波|负峰切割|惰性失真', '二极管包络检波适合普通 AM。二极管给电容充电，电阻放电，使输出跟随包络。$RC$ 过大易产生惰性失真；交直流负载差异过大易产生负峰切割失真。', '不要把过调制、惰性失真、负峰切割失真混为一谈。'],
    ['抑制载波调幅|DSB|SSB|边带信号', 'DSB-SC 只含上下边带，不含载波；SSB 只保留一个边带。因为没有普通 AM 的完整包络，通常不能用普通包络检波，而要用同步检波。', 'AM 有载波和上下边带；DSB 无载波但有上下边带；SSB 只剩一个边带。'],
    ['调频|调相|角度调制|调频指数|频偏|FM|PM', 'FM 和 PM 都属于角度调制。单音 FM 常写为 $u_{FM}(t)=U_c\\cos(\\omega_c t+m_f\\sin\\Omega t)$，其中 $m_f=\\frac{\\Delta f_m}{F}$。', '最大频偏 $\\Delta f_m$ 与调制信号幅度有关；调频指数 $m_f$ 还要除以调制频率 $F$。'],
    ['混频|变频|超外差|镜像干扰|中频', '混频的本质是频谱搬移。输入频率 $f_s$ 与本振频率 $f_L$ 经过非线性或乘法作用后产生 $f_L+f_s$、$|f_L-f_s|$ 等分量，再由滤波器选出中频。', '混频不是简单放大，而是改变频率位置。'],
    ['锁相环|PLL|锁定|捕捉|鉴相器|VCO', '锁相环 PLL 通常由鉴相器、环路滤波器和压控振荡器组成。锁定后，输出与输入参考信号保持固定相位关系，频率相等或满足分频/倍频关系。', '锁定后相位差不一定为零，而是固定值。']
  ];

  let typesetTimer = 0;
  let typesetChain = Promise.resolve();

  sanitizeQuestionTexts();
  enhanceExplanations();
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

  function enhanceExplanations() {
    const questions = window.CE_QUESTIONS || [];
    questions.forEach((q) => {
      if (!q || !q.explanation || q.explanation.enhanced) return;
      const old = String(q.explanation.text || '');
      const info = pickStudyInfo(q);
      const topic = (q.tags && q.tags[0]) || q.typeLabel || '本题相关概念';
      q.explanation.text = [
        `1. 考点：${topic}。`,
        `2. 必要背景：${info.bg}`,
        `3. 读题方法：${readMethod(q)}`,
        `4. 解题过程：${extractAnalysis(old, q)}`,
        `5. 易错点：${info.pitfall}`,
        `6. 结论：${conclusion(q)}`
      ].join('\n\n');
      q.explanation.enhanced = true;
    });
  }

  function pickStudyInfo(q) {
    const text = `${q.stem || ''} ${(q.tags || []).join(' ')} ${(q.options || []).map(o => o.text).join(' ')}`;
    for (const [keys, bg, pitfall] of STUDY_BANK) {
      if (keys.split('|').some(k => text.includes(k))) return { bg, pitfall };
    }
    return {
      bg: '这类题先判断题干在问概念、工作状态、频率关系还是公式代入。把题目归到振荡、调幅、检波、混频、调频调相、功率放大或锁相环中的一个模块，再用对应规律判断。',
      pitfall: '不要只看熟悉词，要看题干限定条件。很多选项本身像是对的，但与题目所问条件不匹配。'
    };
  }

  function readMethod(q) {
    if (q.type === 'blank') return '填空题先判断每个空是概念名词、频率数值、工作状态还是公式结果。若出现角频率 $\\omega$ 或 $\\Omega$，通常要先用 $f=\\frac{\\omega}{2\\pi}$ 或 $F=\\frac{\\Omega}{2\\pi}$ 换算。';
    if (q.type === 'multiple') return '多选题要逐项核对，不能只找一个正确说法。先圈出题干关键词，再判断每个选项是否完全符合定义、公式或工作状态。';
    return '单选题先看题干关键词，判断它在问定义、条件、功能、频率关系还是公式代入。确定模块后，再排除与该模块规律不一致的选项。';
  }

  function extractAnalysis(text, q) {
    const m = String(text || '').match(/选项分析或计算过程[:：]\s*([\s\S]*?)(?:\n\s*\d+\.\s*结论[:：]|$)/);
    let body = m ? m[1].trim() : '';
    body = body.replace(/\[图\/公式\]/g, '相应公式').replace(/\s{2,}/g, ' ').trim();
    if (body.length < 30) return q.type === 'blank' ? `按题干已知量逐空代入，注意单位换算。${answerSentence(q)}` : `逐项比较选项与定义、公式或工作状态是否一致。${answerSentence(q)}`;
    return body;
  }

  function conclusion(q) {
    return q.type === 'blank' ? `各空答案为：${formatAnswer(q)}。` : `正确答案为 ${q.answer.join('、')}。`;
  }
  function answerSentence(q) {
    return q.type === 'blank' ? `本题答案为 ${formatAnswer(q)}。` : `本题正确答案为 ${q.answer.join('、')}。`;
  }
  function formatAnswer(q) {
    if (q.type !== 'blank') return (q.answer || []).join('、');
    return (q.answer || []).map((variants, i) => `(${i + 1}) ${Array.isArray(variants) ? variants[0] : variants}`).join('；');
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
