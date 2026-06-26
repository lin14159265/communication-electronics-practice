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
    'assets/img_a7a65b2d4c35.png': 'u=\\cos 2\\pi\\times10^6t+0.15\\cos2\\pi\\times1.002\\times10^6t+0.15\\cos2\\pi\\times0.998\\times10^6t',
    'assets/img_f0654e96376a.jpg': '\\omega_L=\\omega_0',
    'assets/img_03877ddcd255.jpg': '\\varphi_e(t)=\\varphi_{e\\infty}',
    'assets/img_f3b932d6ba8d.jpg': '\\varphi_e(t)=0',
    'assets/img_60447fd57e2b.jpg': '\\Delta\\omega=\\Delta\\omega_L',
    'assets/img_d035fb613b12.png': 'u_s(t)=U_s\\cos\\omega_s t\\cos\\Omega t',
    'assets/img_d0d85f125778.png': 'u_L(t)=U_L\\cos\\omega_L t'
  };

  const CUSTOM = {
    6: `1. 考点：二极管包络检波的负峰切割失真条件。\n\n2. 必要背景：二极管包络检波用二极管和 RC 回路跟随普通 AM 波包络。负峰切割失真不是“电容放电太慢”，而是检波器交流负载与直流负载不一致，导致包络负峰处被削掉。避免条件常写成 $m_a\\le\\frac{Z_L(\\Omega)}{Z_L(0)}$。\n\n3. 读题方法：看到“负峰切割失真”，先不要套 $RC$ 惰性失真公式，也不要只看 $m_a\\le1$，而要找“交直流负载比”相关条件。\n\n4. 解题过程：A 项更接近惰性失真相关判断；B 项 $m_a\\le\\frac{Z_L(\\Omega)}{Z_L(0)}$ 正是负峰切割失真的避免条件；C 项 $m_a\\le1$ 只是避免过调制；D 项 $m_a=1$ 是满调幅状态，不是检波无失真条件。\n\n5. 易错点：过调制、惰性失真、负峰切割失真是三件事。过调制看 $m_a$ 是否超过 1；惰性失真主要看 $RC$；负峰切割看交直流负载关系。\n\n6. 结论：正确答案为 B。`,
    32: `1. 考点：调相 PM 的最大相偏。\n\n2. 必要背景：调相波的定义是“载波相位随调制信号变化”。单频调相时，相位偏移与调制信号瞬时值成正比；最大相偏 $\\Delta\\varphi_m$ 则与调制信号幅度 $U_\\Omega$ 成正比。\n\n3. 读题方法：题干问“最大相偏”而不是“瞬时相偏”，所以要找幅度量，而不是瞬时信号、积分信号或角频率。\n\n4. 解题过程：A 项 $U_\\Omega$ 是调制信号幅度，符合最大相偏的定义；B 项 $u_\\Omega(t)$ 是瞬时值；C 项 $\\int u_\\Omega(t)\\,dt$ 更像调频相位表达式里的量；D 项 $\\Omega$ 是调制角频率，不直接决定最大相偏。\n\n5. 易错点：PM 是相位偏移与调制信号成正比；FM 是频率偏移与调制信号成正比。\n\n6. 结论：正确答案为 A。`,
    53: `1. 考点：模拟乘法器调幅电路的类型判断。\n\n2. 必要背景：普通 AM 的表达式里要有载波项，例如 $U_c(1+m_a\\cos\\Omega t)\\cos\\omega_c t$；而乘法器若只把调制信号 $u_\\Omega(t)$ 与载波 $u_c(t)$ 相乘，会得到 $u_\\Omega(t)u_c(t)$，展开后只有上下边带，没有单独载波，这就是抑制载波双边带 DSB。\n\n3. 读题方法：看乘法器输入端有没有直流偏置或额外载波通路。没有直流偏置、只有低频调制信号乘载波，通常就是 DSB-SC。\n\n4. 解题过程：本题中 $u_\\Omega(t)=U_{\\Omega m}\\cos\\Omega t$，$u_c(t)=U_{cm}\\cos\\omega_ct$。乘法输出与 $\\cos\\Omega t\\cos\\omega_ct$ 成正比，利用积化和差可得到 $\\omega_c+\\Omega$ 与 $\\omega_c-\\Omega$ 两个边频分量。带通滤波器中心在 $f_c$ 附近，选出的仍是双边带信号，但没有独立载波。\n\n5. 易错点：题目说“调幅电路”不等于一定是普通 AM。乘法器直接相乘通常得到 DSB；普通 AM 需要保留载波。\n\n6. 结论：正确答案为 B，即 DSB。`,
    91: `1. 考点：乘法器框图实现混频。\n\n2. 必要背景：混频的本质是频谱搬移。两个余弦信号相乘后，利用公式 $\\cos A\\cos B=\\frac{1}{2}[\\cos(A+B)+\\cos(A-B)]$，会产生和频与差频分量。后面的带通滤波器再选出需要的频率成分。\n\n3. 读题方法：看到“乘法器 + 本振信号 + 带通滤波器”，优先判断为变频/混频，而不是普通调幅或检波。\n\n4. 解题过程：输入信号 $u_s(t)=U_s\\cos\\omega_s t\\cos\\Omega t$ 是已调信号，本振为 $u_L(t)=U_L\\cos\\omega_Lt$。两者相乘后，各频谱分量都会搬移到 $\\omega_L\\pm(\\omega_s\\pm\\Omega)$ 附近，带通滤波器选出目标频带，所以该框图的功能是频率变换。\n\n5. 易错点：调幅是把信息加载到载波上；检波是从已调波取出低频信息；混频是把频谱整体搬到另一个中心频率。\n\n6. 结论：正确答案为 C，即混频。`,
    117: `1. 考点：二极管平衡电路的混频功能。\n\n2. 必要背景：二极管平衡电路利用二极管的非线性和对称性，可以让两个输入信号相互作用，产生频率组合项。若电路输入中同时出现载波/本振类信号和另一个已调信号，输出又经负载取出组合频率，就常用于混频。\n\n3. 读题方法：不要只看信号表达式里出现了 AM 形式，就直接选 AM。题干问的是“该电路可用来实现什么功能”，应从电路结构和频率变换作用判断。\n\n4. 解题过程：本题给出上下对称、二极管一致的电路，这是平衡非线性结构。输入信号相乘后会产生和频、差频以及边频搬移结果，符合混频电路的典型作用。AM、DSB、SSB 是调制信号类型，而不是这个电路在题设下最直接的功能描述。\n\n5. 易错点：混频电路可能处理 AM 或 DSB 信号，但处理对象不是功能名称。功能看“频率是否被搬移”。\n\n6. 结论：正确答案为 D，即混频。`,
    120: `1. 考点：调频指数 $m_f$ 与频偏、调制频率的关系。\n\n2. 必要背景：调频指数定义为 $m_f=\\frac{\\Delta f_m}{F}$。最大频偏 $\\Delta f_m$ 与调制信号幅度成正比，而分母 $F$ 是调制信号频率。\n\n3. 读题方法：题目同时改变了“幅度”和“频率”，所以不能只看一个因素。先看幅度如何影响 $\\Delta f_m$，再看频率如何影响分母。\n\n4. 解题过程：幅度从 $1V$ 降到 $0.5V$，最大频偏变为原来的 $\\frac{1}{2}$；频率从 $1kHz$ 增到 $2kHz$，分母变为原来的 2。因此新调频指数为 $\\frac{1/2}{2}m_f=\\frac{1}{4}m_f$。\n\n5. 易错点：只考虑幅度会选 $\\frac{1}{2}m_f$；只考虑频率也会得到 $\\frac{1}{2}m_f$；本题两个变化要叠加。\n\n6. 结论：正确答案为 B，即 $\\frac{1}{4}m_f$。`,
    147: `1. 考点：从 AM 波形读调幅度。\n\n2. 必要背景：普通 AM 波包络的最大值和最小值分别记为 $U_{max}$、$U_{min}$，调幅度公式为 $m_a=\\frac{U_{max}-U_{min}}{U_{max}+U_{min}}$。它反映包络起伏深度，而不是载波频率或周期。\n\n3. 读题方法：从图上读包络最高处和最低处的幅度，再代入调幅度公式。只要比例读对，单位不影响结果。\n\n4. 解题过程：图中包络最大值与最小值代入 $m_a=\\frac{U_{max}-U_{min}}{U_{max}+U_{min}}$ 后，得到约 $0.67$。选项中与该结果对应的是 C。\n\n5. 易错点：不要用“峰峰值/周期”去算调幅度，也不要把示波器横轴时间读数当成调幅度。调幅度只看包络上下幅值。\n\n6. 结论：正确答案为 C。`,
    164: `1. 考点：AM 频谱的上下边频和通带宽度。\n\n2. 必要背景：AM 频谱以载波频率 $f_c$ 为中心，调制频率范围最高到 $F_{max}$ 时，最高边频为 $f_c+F_{max}$，最低边频为 $f_c-F_{max}$，总带宽为 $2F_{max}$。\n\n3. 读题方法：先由载波角频率求 $f_c$，再用最高调制频率求上下边频。注意题目给的是 $u_c=U_{cm}\\sin(16\\times10^5\\pi t)$，里面的系数是角频率。\n\n4. 解题过程：$\\omega_c=16\\times10^5\\pi$，所以 $f_c=\\frac{\\omega_c}{2\\pi}=800000Hz=800kHz$。最高调制频率 $F_{max}=5000Hz=5kHz$，所以最高频率为 $805kHz$，最低频率为 $795kHz$，通带中心为 $800kHz$，宽度为 $10kHz$。\n\n5. 易错点：不要把 $16\\times10^5\\pi$ 直接当频率；也不要用 $5000-50$ 求带宽。AM 带宽按最高调制频率的两倍算。\n\n6. 结论：各空答案为：(1) $805kHz$；(2) $795kHz$；(3) $800kHz$；(4) $10kHz$。`,
    165: `1. 考点：由 AM 频谱表达式求总功率和带宽。\n\n2. 必要背景：普通 AM 总功率为 $P=P_c(1+\\frac{m_a^2}{2})$。展开频谱中，若载波幅度为 1，上下边频幅度各为 $\\frac{m_a}{2}$。边频位置为 $f_c\\pm F$，所以两边频间隔总宽度为 $2F$。\n\n3. 读题方法：先从表达式读出载波和边频：载波在 $1MHz$，边频在 $1.002MHz$ 和 $0.998MHz$，说明调制频率 $F=2kHz$；边频幅度 0.15 等于 $\\frac{m_a}{2}$，所以 $m_a=0.3$。\n\n4. 解题过程：已知 $P_c=500W$，$m_a=0.3$，代入 $P=P_c(1+\\frac{m_a^2}{2})=500(1+\\frac{0.3^2}{2})=500(1+0.045)=522.5W$。带宽 $BW=2F=2\\times2kHz=4kHz$。\n\n5. 易错点：本题给的是展开后的频谱式，不是标准包络式。要从边频幅度反推 $m_a$，从边频与载波的频率差反推 $F$。\n\n6. 结论：各空答案为：(1) $522.5W$；(2) $4kHz$。`,
    167: `1. 考点：FM 波带宽的卡森公式。\n\n2. 必要背景：单音 FM 波 $u_{FM}(t)=U_c\\cos(\\omega_ct+m_f\\sin\\Omega t)$ 中，$m_f$ 是调频指数，$F=\\frac{\\Omega}{2\\pi}$，最大频偏 $\\Delta f_m=m_fF$。工程上常用卡森公式 $BW\\approx2(\\Delta f_m+F)=2(m_f+1)F$。\n\n3. 读题方法：先从公式读出 $m_f=25$ 和 $F=\\frac{6\\pi\\times10^3}{2\\pi}=3kHz$。再求 $\\Delta f_m=25\\times3kHz=75kHz$。\n\n4. 解题过程：原带宽 $BW=2(75kHz+3kHz)=156kHz$。当调制信号幅度不变时，最大频偏 $\\Delta f_m$ 不变，仍为 $75kHz$；调制频率加倍为 $6kHz$，所以新带宽 $BW=2(75kHz+6kHz)=162kHz$。题库也接受邻近近似值时，以标准计算 $162kHz$ 为主。\n\n5. 易错点：幅度不变意味着最大频偏不变，不是调频指数不变。频率加倍后，$m_f$ 会变小。\n\n6. 结论：各空答案为：(1) $156kHz$；(2) $162kHz$。`,
    170: `1. 考点：从 FM 波表达式读最大频偏和调频指数。\n\n2. 必要背景：标准单音 FM 表达式为 $u_{FM}(t)=U_c\\cos(\\omega_ct+m_f\\sin\\Omega t)$。相角中 $\\sin\\Omega t$ 前的系数就是 $m_f$，调制频率 $F=\\frac{\\Omega}{2\\pi}$，最大频偏 $\\Delta f_m=m_fF$。\n\n3. 读题方法：题中 $u_{FM}(t)=5\\cos(2\\pi\\times10^7t+25\\sin6\\pi\\times10^3t)$。直接读得 $m_f=25$，$\\Omega=6\\pi\\times10^3$。\n\n4. 解题过程：$F=\\frac{6\\pi\\times10^3}{2\\pi}=3000Hz$。因此 $\\Delta f_m=m_fF=25\\times3000=75000Hz=75kHz$。\n\n5. 易错点：不要把 25 当频偏，也不要把 $6\\pi\\times10^3$ 直接当普通频率。\n\n6. 结论：各空答案为：(1) $75000Hz$；(2) $25$。`,
    191: `1. 考点：从 AM 方程读调制频率、载波频率和调幅系数。\n\n2. 必要背景：普通 AM 的标准形式是 $u_{AM}(t)=U_c(1+m_a\\cos\\Omega t)\\cos\\omega_ct$。括号里的低频余弦对应调制信号，后面的高频余弦对应载波，低频余弦前的系数就是调幅系数 $m_a$。\n\n3. 读题方法：把表达式分成三部分：外面的幅度 50、括号中的 $0.5\\cos2\\pi\\times10^2t$、后面的 $\\cos2\\pi\\times10^6t$。\n\n4. 解题过程：低频项 $\\cos2\\pi\\times10^2t$ 对应调制信号频率 $100Hz$；高频项 $\\cos2\\pi\\times10^6t$ 对应载波频率 $1MHz$；括号中低频余弦前的系数为 0.5，所以调幅系数为 0.5。\n\n5. 易错点：外面的 50 是载波幅度，不是调幅系数；$0.5$ 才是包络起伏深度。\n\n6. 结论：各空答案为：(1) $100Hz$；(2) $1MHz$；(3) $0.5$。`
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
  document.addEventListener('DOMContentLoaded', () => typesetMathSoon());

  function sanitizeQuestionTexts() {
    (window.CE_QUESTIONS || []).forEach(q => {
      if (q && q.explanation && typeof q.explanation.text === 'string') q.explanation.text = cleanExplanationText(q.explanation.text, q);
    });
  }
  function cleanExplanationText(text, q) {
    const images = Array.isArray(q.images) ? q.images : [];
    let imageCursor = 0, removed = false, removedNumber = 3, skipping = false;
    const lines = [];
    String(text || '').replace(/\n+\s*---\s*$/g, '').split(/\n/).forEach(line => {
      const head = line.match(/^\s*(\d+)\.\s*图片\/公式\/电路图信息：?\s*$/);
      if (head) { removed = true; removedNumber = Number(head[1]) || 3; skipping = true; return; }
      if (skipping) { if (/^\s*\d+\.\s+/.test(line)) { skipping = false; lines.push(renumberLine(line, removedNumber)); } return; }
      if (/题库提取_assets\//.test(line) || /已检查，可见，尺寸/.test(line)) { removed = true; return; }
      lines.push(removed ? renumberLine(line, removedNumber) : line);
    });
    return lines.join('\n')
      .replace(/`?题库提取_assets\/[^`\s，。；：)]+`?/g, '题图')
      .replace(/已检查，可见，尺寸\s*\d+×\d+，?/g, '')
      .replace(/\[图\/公式\]/g, () => {
        const img = images[imageCursor++];
        const formula = img && FORMULA_IMAGE_LATEX[normalizeSrc(img.src || img)];
        return formula ? `$${formula}$` : '题图';
      })
      .replace(/\n{3,}/g, '\n\n').trim();
  }
  function enhanceExplanations() {
    (window.CE_QUESTIONS || []).forEach(q => {
      if (!q || !q.explanation || q.explanation.enhanced) return;
      if (CUSTOM[q.questionId]) { q.explanation.text = CUSTOM[q.questionId]; q.explanation.enhanced = true; return; }
      const old = String(q.explanation.text || ''), info = pickStudyInfo(q), topic = (q.tags && q.tags[0]) || q.typeLabel || '本题相关概念';
      q.explanation.text = [`1. 考点：${topic}。`, `2. 必要背景：${info.bg}`, `3. 读题方法：${readMethod(q)}`, `4. 解题过程：${extractAnalysis(old, q)}`, `5. 易错点：${info.pitfall}`, `6. 结论：${conclusion(q)}`].join('\n\n');
      q.explanation.enhanced = true;
    });
  }
  function pickStudyInfo(q) {
    const text = `${q.stem || ''} ${(q.tags || []).join(' ')} ${(q.options || []).map(o => o.text).join(' ')}`;
    for (const [keys, bg, pitfall] of STUDY_BANK) if (keys.split('|').some(k => text.includes(k))) return { bg, pitfall };
    return { bg: '这类题先判断题干在问概念、工作状态、频率关系还是公式代入。把题目归到振荡、调幅、检波、混频、调频调相、功率放大或锁相环中的一个模块，再用对应规律判断。', pitfall: '不要只看熟悉词，要看题干限定条件。很多选项本身像是对的，但与题目所问条件不匹配。' };
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
  function conclusion(q) { return q.type === 'blank' ? `各空答案为：${formatAnswer(q)}。` : `正确答案为 ${q.answer.join('、')}。`; }
  function answerSentence(q) { return q.type === 'blank' ? `本题答案为 ${formatAnswer(q)}。` : `本题正确答案为 ${q.answer.join('、')}。`; }
  function formatAnswer(q) { return q.type !== 'blank' ? (q.answer || []).join('、') : (q.answer || []).map((v, i) => `(${i + 1}) ${Array.isArray(v) ? v[0] : v}`).join('；'); }
  function renumberLine(line, removedNumber) { return line.replace(/^(\s*)(\d+)(\.\s+)/, (_, p, num, s) => p + (Number(num) > removedNumber ? Number(num) - 1 : Number(num)) + s); }
  function overrideMarkdownRenderer() {
    window.renderMarkdown = function (md) {
      if (!md) return '';
      let html = escapeHTMLLocal(md);
      html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => renderImageOrFormula(alt, src));
      html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/`([^`]+)`/g, '<span class="kbd">$1</span>').replace(/\n/g, '<br>');
      return html;
    };
    window.renderMarkdownInline = s => window.renderMarkdown(String(s || '')).replace(/<br>/g, ' ');
  }
  function renderImageOrFormula(alt, rawSrc) {
    const src = normalizeSrc(rawSrc), formula = FORMULA_IMAGE_LATEX[src];
    return formula ? `<span class="formula-converted"><span class="formula-latex">$${formula}$</span></span>` : `<img class="md-img" src="${escapeAttrLocal(src)}" alt="${escapeAttrLocal(alt || '题目图片/公式')}" loading="lazy">`;
  }
  function normalizeSrc(src) { return String(src || '').replace(/^\.\//, '').trim(); }
  function wrapRenderFunctions() { ['renderQuestion', 'renderStatsPage', 'showView'].forEach(wrapGlobalFunction); }
  function wrapGlobalFunction(name) { const original = window[name]; if (typeof original !== 'function') return; window[name] = function (...args) { const result = original.apply(this, args); typesetMathSoon(); return result; }; }
  function typesetMathSoon() { clearTimeout(typesetTimer); typesetTimer = setTimeout(() => { if (!window.MathJax || typeof window.MathJax.typesetPromise !== 'function') return; const scope = document.querySelector('.app-shell') || document.body; typesetChain = typesetChain.then(() => window.MathJax.typesetPromise([scope])).catch(err => console.warn('MathJax typeset failed:', err)); }, 0); }
  function injectMathStyles() { const style = document.createElement('style'); style.textContent = `.formula-converted{display:inline-flex;align-items:center;flex-wrap:wrap;vertical-align:middle}.formula-latex{display:inline-block;vertical-align:middle}.mjx-container{overflow-x:auto;overflow-y:hidden;max-width:100%}.option .mjx-container{max-width:100%}`; document.head.appendChild(style); }
  function escapeHTMLLocal(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function escapeAttrLocal(s) { return escapeHTMLLocal(s).replace(/`/g, '&#96;'); }
})();
