(function () {
  const KEEP_CUSTOM = new Set([6, 32, 53, 91, 117, 120, 147, 164, 165, 167, 170, 191]);
  const MODULES = [
    {
      keys: ['石英晶体', '晶体振荡器'],
      bg: '石英晶体的核心价值是频率稳定度高。做题时主要记两点：串联谐振点 $f_s$ 附近阻抗很小，近似阻性或短路；在 $f_s<f<f_p$ 区间呈感性，可作为并联型晶体振荡器中的等效电感。',
      method: '先看题目问串联型还是并联型，再看给出的频率是 $f_s$ 点还是 $f_s$ 到 $f_p$ 之间的区间。',
      pitfall: '不要把 $f_s$ 点和 $f_s<f<f_p$ 区间混淆；串联型常看低阻，並联型常看感性。'
    },
    {
      keys: ['调频', '调相', '角度调制', '频偏', '调频指数', 'FM', 'PM'],
      bg: 'FM 和 PM 都属于角度调制，幅度不是主要信息载体。FM 是瞬时频率偏移随调制信号变化，PM 是瞬时相位偏移随调制信号变化。单音 FM 常用 $m_f=\\frac{\\Delta f_m}{F}$，其中 $\\Delta f_m$ 是最大频偏，$F$ 是调制频率。',
      method: '先判断题目问的是 FM 还是 PM，再分清“频偏、调频指数、相偏、角频率”这几个量。遇到 $\\omega$ 或 $\\Omega$ 时通常要除以 $2\\pi$ 转成普通频率。',
      pitfall: '不要把频偏 $\\Delta f_m$ 和调频指数 $m_f$ 混用；也不要以为 PM 只变相位、频率完全不变。'
    },
    {
      keys: ['振幅调制', '调幅系数', 'AM', '普通调幅'],
      bg: '普通 AM 是让载波幅度随调制信号变化，标准式可写为 $u_{AM}=U_c(1+m_a\\cos\\Omega t)\\cos\\omega_ct$。频谱包括载波和上下边带，单音调制时带宽为 $2F$。',
      method: '看到 AM 题，先找载波、调制信号、调幅系数 $m_a$ 和边频位置。若表达式中有 “$1+$ 调制项”，通常是普通 AM；若只是两个信号相乘，常是 DSB。',
      pitfall: '调幅系数不是载波幅度；AM 带宽主要由调制频率决定，不由调制信号振幅决定。'
    },
    {
      keys: ['包络检波', '检波', '二极管', '负峰切割', '惰性失真'],
      bg: '二极管包络检波利用二极管充电、电阻放电，使输出电压跟随普通 AM 的包络。$RC$ 太大会放电跟不上，产生惰性失真；交直流负载差异过大，可能产生负峰切割失真。',
      method: '先判断题干问的是检波原理、惰性失真还是负峰切割。出现 $RC$ 和调制角频率，多半与惰性失真有关；出现负载比，多半与负峰切割有关。',
      pitfall: '包络检波适合普通 AM，不适合直接解调 DSB-SC 或 SSB；不要把三类失真条件混在一起。'
    },
    {
      keys: ['丙类', '谐振功率放大器', '高频功放', '导通角'],
      bg: '丙类谐振功放的导通角小于 $180^\\circ$，晶体管电流是脉冲，因此效率高。输出端 LC 谐振回路负责选出所需频率成分并完成负载匹配，使输出电压接近正弦。',
      method: '功放题先看问的是效率、导通角、输出回路作用，还是欠压/临界/过压状态。不同用途下状态选择不同，不能一概选临界。',
      pitfall: '电流是脉冲不代表输出电压一定是脉冲；高效率主要来自丙类导通角小，不是简单来自 LC 滤波。'
    },
    {
      keys: ['混频', '变频', '超外差', '中频', '本振'],
      bg: '混频的本质是频谱搬移。输入信号与本振相乘后，会产生和频与差频，再通过滤波器选出固定中频。超外差接收机依靠这个过程把不同载频统一变成固定中频。',
      method: '遇到混频题，优先列出信号频率、本振频率和中频，使用 $f_I=|f_L-f_s|$。若题目出现乘法器或非线性器件，也要想到会产生和差频。',
      pitfall: '混频不是检波，也不是单纯放大；它改变频率位置，但不直接恢复原低频信息。'
    },
    {
      keys: ['锁相环', 'PLL', '锁定', '鉴相器', 'VCO', '环路滤波器', '自动相位控制'],
      bg: '锁相环由鉴相器、环路滤波器和压控振荡器等组成。锁定时，输出与参考信号保持固定相位关系，频率相等或满足固定比例关系。',
      method: 'PLL 题先分清它问组成、锁定条件、滤波器作用还是缩写含义。鉴相器看相位差，滤波器保留低频误差信号，VCO 根据控制电压改变频率。',
      pitfall: '锁定不等于相位差一定为零，而是相位差稳定为常数。AGC、AFC、APC、PLL 不要混。'
    },
    {
      keys: ['小信号调谐放大器', '通频带', '品质因数', '选择性', '双调谐'],
      bg: '小信号调谐放大器依靠 LC 回路选频。常用关系是 $BW=\\frac{f_0}{Q}$：Q 越高，通频带越窄，选择性越好；Q 降低，通频带变宽，选择性下降。',
      method: '先判断题干在说单调谐级联、双调谐回路，还是并联损耗电阻。不同结构对通频带的影响不同。',
      pitfall: '不要把所有“级数增加”都理解成带宽变宽；同步单调谐级联往往变窄，双调谐耦合回路可展宽。'
    },
    {
      keys: ['DSB', 'SSB', '抑制载波', '边带'],
      bg: 'AM、DSB、SSB 的区别主要看频谱。普通 AM 有载波和上下边带；DSB-SC 抑制载波，只剩上下边带；SSB 只保留一个边带。',
      method: '判断信号类型时，先看有没有载波，再看有几个边带。表达式中若有中心频率项和两个对称边频，通常是 AM；若没有载波但有两边带，是 DSB。',
      pitfall: 'DSB 和 SSB 通常不能用普通包络检波，因为没有普通 AM 那种完整包络。'
    }
  ];

  const questions = window.CE_QUESTIONS || [];
  questions.forEach(q => {
    if (!q || !q.explanation || KEEP_CUSTOM.has(q.questionId)) return;
    const module = pickModule(q);
    q.explanation.text = buildExplanation(q, module);
    q.explanation.enhanced = true;
  });

  function pickModule(q) {
    const hay = `${q.stem || ''} ${(q.tags || []).join(' ')} ${(q.options || []).map(o => o.text).join(' ')}`;
    return MODULES.find(m => m.keys.some(k => hay.includes(k))) || {
      bg: '这类题的关键不是死背选项，而是先判断题干问的是概念定义、工作状态、频率关系还是公式代入。确定模块后，再看选项是否满足题干限定条件。',
      method: '先圈题干关键词，再比较每个选项是否与题意一致。遇到公式量时，注意物理量含义、单位和角频率/普通频率的区别。',
      pitfall: '很多错误选项本身是“看起来正确的概念”，但与本题所问对象或条件不匹配。'
    };
  }

  function buildExplanation(q, m) {
    const topic = (q.tags && q.tags[0]) || q.typeLabel || '本题相关概念';
    return [
      `1. 考点：${topic}。`,
      `2. 必要背景：${m.bg}`,
      `3. 读题方法：${m.method}`,
      `4. 解题过程：${analysis(q)}`,
      `5. 易错点：${m.pitfall}`,
      `6. 结论：${conclusion(q)}`
    ].join('\n\n');
  }

  function analysis(q) {
    if (q.type === 'blank') {
      return `本题属于填空题，先根据题干判断每个空对应的是概念名词、工作状态还是公式计算结果。题干中的关键词是“${brief(q.stem)}”。答案应逐空填写为：${formatAnswer(q)}。`;
    }
    const ans = new Set(q.answer || []);
    const opts = q.options || [];
    const correct = opts.filter(o => ans.has(o.key)).map(o => `${o.key} 项“${trimOpt(o.text)}”`).join('、');
    const wrong = opts.filter(o => !ans.has(o.key)).slice(0, 3).map(o => `${o.key} 项不符合题干限定`).join('；');
    if (q.type === 'multiple') {
      return `本题是多选题，不能只找一个熟悉说法，要逐项核对。${correct ? `符合题意的是 ${correct}。` : ''}${wrong ? `其余选项的问题在于：${wrong}。` : ''}`;
    }
    return `题干关键词是“${brief(q.stem)}”。在这些选项中，${correct || `正确选项 ${q.answer.join('、')}`} 与本题考点和题干限定条件一致。${wrong ? `其他选项可排除：${wrong}。` : ''}`;
  }

  function conclusion(q) {
    return q.type === 'blank' ? `各空答案为：${formatAnswer(q)}。` : `正确答案为 ${q.answer.join('、')}。`;
  }
  function formatAnswer(q) {
    if (q.type !== 'blank') return (q.answer || []).join('、');
    return (q.answer || []).map((v, i) => `(${i + 1}) ${Array.isArray(v) ? v[0] : v}`).join('；');
  }
  function brief(s) {
    return String(s || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '题图').replace(/\s+/g, ' ').trim().slice(0, 48);
  }
  function trimOpt(s) {
    return String(s || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '题图').replace(/\s+/g, ' ').trim().slice(0, 42);
  }
})();
