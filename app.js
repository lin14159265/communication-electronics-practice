
const QUESTIONS = window.CE_QUESTIONS || [];
const STORAGE_KEY = 'ce_practice_records_v1';
const PREF_KEY = 'ce_practice_preferences_v1';
const SESSION_KEY = 'ce_practice_session_v1';

const TYPE_LABELS = { single: '单选题', multiple: '多选题', blank: '填空题' };
let state = {
  view: 'home',
  queue: [],
  index: 0,
  selected: [],
  blanks: [],
  submitted: false,
  lastResult: null,
  modeName: '全部练习',
  batchMode: false,
  sessionAnswers: {},
  explanationOpen: false,
};
let records = loadRecords();
let preferences = loadPreferences();

const $ = (id) => document.getElementById(id);
const qById = new Map(QUESTIONS.map(q => [q.questionId, q]));

document.addEventListener('DOMContentLoaded', () => {
  applyTheme(preferences.theme || 'light');
  bindEvents();
  renderAllStats();
  showView('home');
  const saved = safeJSON(localStorage.getItem(SESSION_KEY));
  if (saved && Array.isArray(saved.queue) && saved.queue.length) {
    $('restoreBox').classList.remove('hidden');
  }
});

function bindEvents() {
  document.querySelectorAll('[data-view]').forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
  document.querySelectorAll('[data-start]').forEach(btn => btn.addEventListener('click', () => startMode(btn.dataset.start)));
  $('themeBtn').addEventListener('click', toggleTheme);
  $('restoreBtn').addEventListener('click', restoreSession);
  $('discardSessionBtn').addEventListener('click', () => { localStorage.removeItem(SESSION_KEY); $('restoreBox').classList.add('hidden'); toast('已放弃上次练习进度。'); });
  $('submitBtn').addEventListener('click', submitCurrent);
  $('nextBtn').addEventListener('click', () => goQuestion(state.index + 1));
  $('prevBtn').addEventListener('click', () => goQuestion(state.index - 1));
  $('toggleExplainBtn').addEventListener('click', () => { state.explanationOpen = !state.explanationOpen; renderQuestion(); });
  $('bookmarkBtn').addEventListener('click', toggleBookmark);
  $('uncertainBtn').addEventListener('click', toggleUncertain);
  $('masteredBtn').addEventListener('click', toggleMastered);
  $('dontKnowBtn').addEventListener('click', dontKnow);
  $('typeFilter').addEventListener('change', () => syncRangeOptions());
  $('advancedStartBtn').addEventListener('click', startAdvanced);
  $('exportBtn').addEventListener('click', exportRecords);
  $('exportWrongBtn').addEventListener('click', exportWrongMarkdown);
  $('importFile').addEventListener('change', importRecords);
  $('clearBtn').addEventListener('click', clearRecords);
  $('finishBtn').addEventListener('click', finishRound);
  window.addEventListener('beforeunload', persistSession);
  syncRangeOptions();
}

function showView(view) {
  state.view = view;
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  $(`view-${view}`).classList.add('active');
  document.querySelectorAll('[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if (view === 'stats') renderStatsPage();
  if (view === 'practice' && state.queue.length) renderQuestion();
  renderAllStats();
}

function startMode(mode) {
  const prefs = readAdvancedPrefs(false);
  let pool = QUESTIONS.slice();
  let modeName = '';
  switch(mode) {
    case 'sequential': modeName = '顺序练习'; pool = filterByTypeAndRange(pool, prefs); break;
    case 'random': modeName = '随机练习'; pool = filterByTypeAndRange(pool, prefs); pool = shuffle(pool); break;
    case 'wrong': modeName = '错题重练'; pool = pool.filter(q => getRec(q.questionId).wrongCount > 0); pool = sortByWrong(pool); break;
    case 'unmastered': modeName = '未掌握题'; pool = pool.filter(q => !getRec(q.questionId).mastered && (getRec(q.questionId).wrongCount > 0 || getRec(q.questionId).uncertain || getRec(q.questionId).dontKnow)); pool = sortByWrong(pool); break;
    case 'bookmarked': modeName = '收藏题'; pool = pool.filter(q => getRec(q.questionId).bookmarked); break;
    case 'uncertain': modeName = '不确定 / 待复习'; pool = pool.filter(q => getRec(q.questionId).uncertain); break;
    default: modeName = '全部练习'; pool = filterByTypeAndRange(pool, prefs);
  }
  if (mode !== 'wrong' && mode !== 'unmastered' && mode !== 'bookmarked' && mode !== 'uncertain') {
    if (prefs.order === 'random') pool = shuffle(pool);
  }
  if (prefs.count && prefs.count > 0) pool = pool.slice(0, prefs.count);
  beginQueue(pool, modeName, prefs.batchMode);
}

function startAdvanced() {
  const prefs = readAdvancedPrefs(true);
  let pool = filterByTypeAndRange(QUESTIONS.slice(), prefs);
  switch (prefs.pool) {
    case 'wrong': pool = pool.filter(q => getRec(q.questionId).wrongCount > 0); break;
    case 'uncertain': pool = pool.filter(q => getRec(q.questionId).uncertain); break;
    case 'bookmarked': pool = pool.filter(q => getRec(q.questionId).bookmarked); break;
    case 'unmastered': pool = pool.filter(q => !getRec(q.questionId).mastered); break;
    case 'undone': pool = pool.filter(q => getRec(q.questionId).attempts === 0); break;
  }
  if (prefs.minWrong > 0) pool = pool.filter(q => getRec(q.questionId).wrongCount >= prefs.minWrong);
  if (prefs.order === 'random') pool = shuffle(pool); else pool = pool.sort((a,b)=>a.questionId-b.questionId);
  if (prefs.count > 0) pool = pool.slice(0, prefs.count);
  beginQueue(pool, '自定义练习', prefs.batchMode);
}

function readAdvancedPrefs(save) {
  syncRangeOptions();
  const prefs = {
    type: $('typeFilter').value,
    range: $('rangeFilter').value,
    pool: $('poolFilter').value,
    order: $('orderFilter').value,
    count: Number($('countFilter').value) || 0,
    minWrong: Number($('minWrongFilter').value) || 0,
    batchMode: $('judgeModeFilter').value === 'batch'
  };
  if (save) {
    preferences.advanced = prefs;
    savePreferences();
  }
  return prefs;
}

function syncRangeOptions() {
  const type = $('typeFilter').value;
  const range = $('rangeFilter');
  const current = range.value;
  const options = rangeOptionsForType(type);
  range.innerHTML = options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('');
  range.value = options.some(opt => opt.value === current) ? current : options[0].value;
}

function rangeOptionsForType(type) {
  if (type === 'single') return [
    { value: 'all', label: '全部单选 1-152' },
    { value: '1-50', label: '1-50 单选题' },
    { value: '51-100', label: '51-100 单选题' },
    { value: '101-152', label: '101-152 单选后段' },
  ];
  if (type === 'multiple') return [
    { value: '153-157', label: '153-157 多选题' },
  ];
  if (type === 'blank') return [
    { value: '158-206', label: '158-206 填空题' },
  ];
  return [
    { value: 'all', label: '全部 1-206' },
    { value: '1-50', label: '1-50' },
    { value: '51-100', label: '51-100' },
    { value: '101-152', label: '101-152 单选后段' },
    { value: '153-157', label: '153-157 多选题' },
    { value: '158-206', label: '158-206 填空题' },
  ];
}

function filterByTypeAndRange(pool, prefs) {
  if (prefs.type && prefs.type !== 'all') pool = pool.filter(q => q.type === prefs.type);
  if (prefs.range && prefs.range !== 'all') {
    const [a,b] = prefs.range.split('-').map(Number);
    pool = pool.filter(q => q.questionId >= a && q.questionId <= b);
  }
  return pool.sort((a,b)=>a.questionId-b.questionId);
}

function beginQueue(pool, modeName, batchMode) {
  if (!pool.length) {
    toast('当前条件下没有可练习的题。');
    return;
  }
  state.queue = pool.map(q => q.questionId);
  state.index = 0;
  state.selected = [];
  state.blanks = [];
  state.submitted = false;
  state.lastResult = null;
  state.modeName = modeName;
  state.batchMode = batchMode;
  state.sessionAnswers = {};
  state.explanationOpen = false;
  persistSession();
  showView('practice');
}

function currentQuestion() {
  return qById.get(state.queue[state.index]);
}

function renderQuestion() {
  const q = currentQuestion();
  if (!q) return;
  const rec = getRec(q.questionId);
  const answered = state.sessionAnswers[q.questionId];
  if (answered && !state.submitted) {
    state.selected = answered.selected || [];
    state.blanks = answered.blanks || [];
    state.submitted = !!answered.submitted;
    state.lastResult = answered.result || null;
  }

  $('modeName').textContent = state.modeName;
  $('progressText').textContent = `第 ${state.index + 1} / ${state.queue.length} 题`;
  $('questionMeta').innerHTML = '';
  const meta = [
    badge(`题号 ${q.questionId}`, 'primary'),
    badge(TYPE_LABELS[q.type] || q.type),
    rec.mastered ? badge('已掌握', 'ok') : '',
    rec.bookmarked ? badge('已收藏', 'warn') : '',
    rec.uncertain ? badge('待复习', 'warn') : '',
    rec.wrongCount ? badge(`错 ${rec.wrongCount} 次`, 'danger') : ''
  ].filter(Boolean).join('');
  $('questionMeta').innerHTML = meta;
  $('stemBox').innerHTML = renderMarkdown(q.stem);
  $('tagsBox').innerHTML = q.tags && q.tags.length ? q.tags.map(t => badge(t)).join('') : badge('未人工核验', 'warn');
  renderAnswerArea(q);
  renderQuestionActions(q, rec);
  renderResult(q);
  renderNavigator();
  $('progressBar').style.width = `${((state.index + 1) / state.queue.length) * 100}%`;
  $('prevBtn').disabled = state.index <= 0;
  $('nextBtn').disabled = state.index >= state.queue.length - 1;
  persistSession();
}

function renderAnswerArea(q) {
  $('optionsBox').innerHTML = '';
  $('blankBox').innerHTML = '';
  if (q.type === 'single' || q.type === 'multiple') {
    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option';
      btn.type = 'button';
      if (state.selected.includes(opt.key)) btn.classList.add('selected');
      if (state.submitted && q.answer.includes(opt.key)) btn.classList.add('correct');
      if (state.submitted && state.selected.includes(opt.key) && !q.answer.includes(opt.key)) btn.classList.add('wrong');
      btn.innerHTML = `<span class="option-key">${opt.key}</span><span>${renderMarkdown(opt.text)}</span>`;
      btn.addEventListener('click', () => selectOption(q, opt.key));
      $('optionsBox').appendChild(btn);
    });
  } else if (q.type === 'blank') {
    const count = q.blanks?.length || (q.answer?.length || 1);
    for (let i = 0; i < count; i++) {
      const row = document.createElement('div');
      row.className = 'blank-row';
      row.innerHTML = `<label>第 ${i + 1} 空</label><input type="text" inputmode="text" autocomplete="off" value="${escapeAttr(state.blanks[i] || '')}" placeholder="输入答案">`;
      row.querySelector('input').addEventListener('input', (e) => {
        state.blanks[i] = e.target.value;
        saveSessionAnswer(false);
      });
      $('blankBox').appendChild(row);
    }
  }
}

function selectOption(q, key) {
  if (state.submitted && !state.batchMode) return;
  if (q.type === 'single') state.selected = [key];
  else if (state.selected.includes(key)) state.selected = state.selected.filter(k => k !== key);
  else state.selected = [...state.selected, key].sort();
  saveSessionAnswer(false);
  renderQuestion();
}

function renderQuestionActions(q, rec) {
  $('bookmarkBtn').textContent = rec.bookmarked ? '取消收藏' : '收藏';
  $('uncertainBtn').textContent = rec.uncertain ? '取消待复习' : '不确定';
  $('masteredBtn').textContent = rec.mastered ? '取消掌握' : '标记掌握';
  $('submitBtn').textContent = state.batchMode ? '保存本题答案' : '提交答案';
  $('submitBtn').disabled = state.submitted && !state.batchMode;
  $('finishBtn').classList.toggle('hidden', !state.batchMode);
}

function submitCurrent() {
  const q = currentQuestion();
  if (!q) return;
  if (!hasAnswer(q)) { toast('请先作答，或点击“不会/看答案”。'); return; }
  const result = checkAnswer(q);
  state.submitted = true;
  state.lastResult = result;
  if (state.batchMode) {
    saveSessionAnswer(true);
    toast('已保存本题答案。批量模式下点击“完成本轮”统一统计。');
  } else {
    updateRecord(q.questionId, result);
    saveSessionAnswer(true);
  }
  renderQuestion();
}

function finishRound() {
  if (!state.batchMode) return;
  let done = 0, correct = 0, wrong = 0;
  for (const qid of state.queue) {
    const ans = state.sessionAnswers[qid];
    if (!ans || !ans.submitted || !ans.result) continue;
    updateRecord(qid, ans.result);
    done++;
    if (ans.result.correct) correct++; else wrong++;
  }
  saveRecords();
  toast(`本轮已统计：${done} 题，正确 ${correct}，错误 ${wrong}。`);
  state.batchMode = false;
  renderAllStats();
  renderQuestion();
}

function dontKnow() {
  const q = currentQuestion();
  const rec = getRec(q.questionId);
  rec.uncertain = true;
  rec.mastered = false;
  rec.dontKnow = true;
  rec.updatedAt = Date.now();
  records.items[q.questionId] = rec;
  saveRecords();
  state.submitted = true;
  state.lastResult = { correct: false, dontKnow: true, userAnswer: [], correctAnswer: q.answer, skipped: true };
  state.explanationOpen = true;
  saveSessionAnswer(true);
  renderQuestion();
  toast('已加入未掌握/待复习，未按错题计次。');
}

function hasAnswer(q) {
  if (q.type === 'blank') return state.blanks.some(v => String(v || '').trim());
  return state.selected.length > 0;
}

function checkAnswer(q) {
  let correct = false, userAnswer;
  if (q.type === 'single' || q.type === 'multiple') {
    userAnswer = state.selected.slice().sort();
    const right = q.answer.slice().sort();
    correct = userAnswer.length === right.length && userAnswer.every((v,i)=>v===right[i]);
  } else {
    userAnswer = state.blanks.slice();
    correct = (q.blanks || []).every((blank, i) => {
      const v = normBlank(userAnswer[i]);
      return blank.answers.some(a => normBlank(a) === v);
    });
  }
  return { correct, userAnswer, correctAnswer: q.answer, at: Date.now() };
}

function updateRecord(qid, result) {
  const rec = getRec(qid);
  rec.attempts += 1;
  rec.lastAnswer = result.userAnswer;
  rec.lastCorrect = result.correct;
  rec.lastAt = Date.now();
  rec.updatedAt = Date.now();
  if (result.correct) {
    rec.correctCount += 1;
    rec.consecutiveCorrect = (rec.consecutiveCorrect || 0) + 1;
    rec.uncertain = false;
  } else {
    rec.wrongCount += 1;
    rec.consecutiveCorrect = 0;
    rec.mastered = false;
  }
  records.items[qid] = rec;
  saveRecords();
  renderAllStats();
}

function getRec(qid) {
  const r = records.items[qid] || {};
  return {
    attempts: r.attempts || 0,
    correctCount: r.correctCount || 0,
    wrongCount: r.wrongCount || 0,
    consecutiveCorrect: r.consecutiveCorrect || 0,
    lastAnswer: r.lastAnswer || [],
    lastCorrect: !!r.lastCorrect,
    lastAt: r.lastAt || null,
    updatedAt: r.updatedAt || null,
    bookmarked: !!r.bookmarked,
    uncertain: !!r.uncertain,
    mastered: !!r.mastered,
    dontKnow: !!r.dontKnow
  };
}

function toggleBookmark() {
  const q = currentQuestion(); const rec = getRec(q.questionId);
  rec.bookmarked = !rec.bookmarked; rec.updatedAt = Date.now();
  records.items[q.questionId] = rec; saveRecords(); renderQuestion(); renderAllStats();
}
function toggleUncertain() {
  const q = currentQuestion(); const rec = getRec(q.questionId);
  rec.uncertain = !rec.uncertain; if (rec.uncertain) rec.mastered = false; rec.updatedAt = Date.now();
  records.items[q.questionId] = rec; saveRecords(); renderQuestion(); renderAllStats();
}
function toggleMastered() {
  const q = currentQuestion(); const rec = getRec(q.questionId);
  rec.mastered = !rec.mastered; if (rec.mastered) { rec.uncertain = false; rec.dontKnow = false; } rec.updatedAt = Date.now();
  records.items[q.questionId] = rec; saveRecords(); renderQuestion(); renderAllStats();
}

function renderResult(q) {
  const box = $('resultBox');
  box.className = 'result';
  $('explanationBox').className = 'explanation';
  $('explanationBox').innerHTML = '';
  if (!state.submitted || !state.lastResult) return;
  const result = state.lastResult;
  box.classList.add('show');
  if (result.dontKnow || result.skipped) box.classList.add('neutral');
  else box.classList.add(result.correct ? 'correct' : 'wrong');
  const ansText = formatAnswer(q, q.answer);
  const userText = q.type === 'blank' ? (result.userAnswer || []).join('｜') : (result.userAnswer || []).join('');
  $('resultTitle').textContent = result.dontKnow ? '已标记：不会 / 待复习' : (result.correct ? '回答正确' : '回答错误');
  $('resultDetail').innerHTML = `<div>你的答案：<b>${escapeHTML(userText || '未作答')}</b></div><div>正确答案：<b>${renderMarkdownInline(ansText)}</b></div>`;
  $('toggleExplainBtn').textContent = state.explanationOpen ? '收起解析' : '查看解析';
  if (state.explanationOpen) {
    $('explanationBox').classList.add('show');
    $('explanationBox').innerHTML = `<div class="md">${renderMarkdown(q.explanation?.text || '暂无解析')}</div>`;
  }
}

function formatAnswer(q, ans) {
  if (q.type === 'single' || q.type === 'multiple') return ans.join('');
  return (ans || []).map((variants, i) => `(${i+1}) ${Array.isArray(variants) ? variants.join('；') : variants}`).join('  ');
}

function renderNavigator() {
  const nav = $('questionNavigator'); nav.innerHTML = '';
  state.queue.forEach((qid, i) => {
    const q = qById.get(qid); const rec = getRec(qid);
    const btn = document.createElement('button');
    btn.className = 'nav-dot';
    if (i === state.index) btn.classList.add('current');
    if (rec.wrongCount > 0) btn.classList.add('wrong');
    else if (rec.attempts > 0) btn.classList.add('done');
    if (rec.uncertain || rec.bookmarked) btn.classList.add('flagged');
    btn.textContent = q.questionId;
    btn.title = `${q.questionId} ${TYPE_LABELS[q.type]}`;
    btn.addEventListener('click', () => goQuestion(i));
    nav.appendChild(btn);
  });
}

function goQuestion(i) {
  if (i < 0 || i >= state.queue.length) return;
  saveSessionAnswer(state.submitted);
  state.index = i;
  const ans = state.sessionAnswers[state.queue[i]];
  state.selected = ans?.selected || [];
  state.blanks = ans?.blanks || [];
  state.submitted = ans?.submitted || false;
  state.lastResult = ans?.result || null;
  state.explanationOpen = false;
  renderQuestion();
  window.scrollTo({top: 0, behavior: 'smooth'});
}

function saveSessionAnswer(submitted) {
  const q = currentQuestion(); if (!q) return;
  state.sessionAnswers[q.questionId] = {
    selected: state.selected.slice(), blanks: state.blanks.slice(), submitted: !!submitted, result: state.lastResult
  };
  persistSession();
}
function persistSession() {
  if (!state.queue.length) return;
  const data = { queue: state.queue, index: state.index, modeName: state.modeName, batchMode: state.batchMode, sessionAnswers: state.sessionAnswers, savedAt: Date.now() };
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
function restoreSession() {
  const saved = safeJSON(localStorage.getItem(SESSION_KEY));
  if (!saved || !saved.queue?.length) { toast('没有可恢复的练习。'); return; }
  state.queue = saved.queue.filter(id => qById.has(id));
  state.index = Math.min(saved.index || 0, state.queue.length - 1);
  state.modeName = saved.modeName || '恢复练习';
  state.batchMode = !!saved.batchMode;
  state.sessionAnswers = saved.sessionAnswers || {};
  const ans = state.sessionAnswers[state.queue[state.index]];
  state.selected = ans?.selected || [];
  state.blanks = ans?.blanks || [];
  state.submitted = ans?.submitted || false;
  state.lastResult = ans?.result || null;
  $('restoreBox').classList.add('hidden');
  showView('practice');
}

function renderAllStats() {
  const s = computeStats();
  $('homeTotal').textContent = QUESTIONS.length;
  $('homeDone').textContent = s.done;
  $('homeWrong').textContent = s.wrong;
  $('homeUncertain').textContent = s.uncertain;
  $('homeAcc').textContent = s.attempts ? `${Math.round(s.correctAttempts / s.attempts * 100)}%` : '—';
  $('miniStats').innerHTML = `已做 <b>${s.done}</b>｜错题 <b>${s.wrong}</b>｜未掌握 <b>${s.unmastered}</b>｜收藏 <b>${s.bookmarked}</b>`;
}
function computeStats() {
  let done=0, wrong=0, uncertain=0, bookmarked=0, mastered=0, attempts=0, correctAttempts=0, unmastered=0;
  for (const q of QUESTIONS) {
    const r = getRec(q.questionId);
    if (r.attempts > 0) done++;
    if (r.wrongCount > 0) wrong++;
    if (r.uncertain) uncertain++;
    if (r.bookmarked) bookmarked++;
    if (r.mastered) mastered++;
    if (!r.mastered && (r.wrongCount > 0 || r.uncertain || r.dontKnow)) unmastered++;
    attempts += r.attempts;
    correctAttempts += r.correctCount;
  }
  return {done, wrong, uncertain, bookmarked, mastered, attempts, correctAttempts, unmastered};
}
function renderStatsPage() {
  const s = computeStats();
  $('statsCards').innerHTML = [
    statCard('总题数', QUESTIONS.length), statCard('已做题', s.done), statCard('错题', s.wrong), statCard('未掌握', s.unmastered),
    statCard('收藏题', s.bookmarked), statCard('待复习', s.uncertain), statCard('总作答', s.attempts), statCard('作答正确率', s.attempts ? `${Math.round(s.correctAttempts / s.attempts * 100)}%` : '—')
  ].join('');
  const rows = QUESTIONS
    .map(q => ({q, r:getRec(q.questionId)}))
    .filter(x => x.r.attempts || x.r.bookmarked || x.r.uncertain || x.r.mastered)
    .sort((a,b)=> (b.r.wrongCount-a.r.wrongCount) || (b.r.updatedAt||0)-(a.r.updatedAt||0));
  $('recordsTable').innerHTML = rows.length ? rows.map(({q,r}) => `
    <tr>
      <td>${q.questionId}</td>
      <td>${TYPE_LABELS[q.type]}</td>
      <td>${r.attempts}</td>
      <td>${r.correctCount}</td>
      <td>${r.wrongCount}</td>
      <td>${r.mastered ? '已掌握' : r.uncertain ? '待复习' : r.bookmarked ? '收藏' : ''}</td>
      <td><button class="secondary-btn" onclick="jumpToSingle(${q.questionId})">练这题</button></td>
    </tr>`).join('') : `<tr><td colspan="7" class="empty">暂无学习记录。</td></tr>`;
}
window.jumpToSingle = function(qid) { beginQueue([qById.get(qid)], `单题练习 ${qid}`, false); };

function loadRecords() {
  const data = safeJSON(localStorage.getItem(STORAGE_KEY));
  if (data && data.version === 1 && data.items) return data;
  return { version: 1, courseId: 'communication_electronics', updatedAt: Date.now(), items: {} };
}
function saveRecords() { records.updatedAt = Date.now(); localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); }
function loadPreferences() { return safeJSON(localStorage.getItem(PREF_KEY)) || {}; }
function savePreferences() { localStorage.setItem(PREF_KEY, JSON.stringify(preferences)); }
function clearRecords() {
  if (!confirm('确认清空本浏览器中的全部学习记录？题库不会被删除。')) return;
  records = { version: 1, courseId: 'communication_electronics', updatedAt: Date.now(), items: {} };
  saveRecords(); localStorage.removeItem(SESSION_KEY); renderAllStats(); renderStatsPage(); toast('学习记录已清空。');
}
function exportRecords() {
  const blob = new Blob([JSON.stringify(records, null, 2)], {type:'application/json;charset=utf-8'});
  downloadBlob(blob, `通信电子线路_学习记录_${dateStamp()}.json`);
}
function exportWrongMarkdown() {
  const wrong = QUESTIONS.filter(q => getRec(q.questionId).wrongCount > 0 || getRec(q.questionId).uncertain || getRec(q.questionId).dontKnow);
  const body = ['# 通信电子线路错题/待复习列表', '', `导出时间：${new Date().toLocaleString()}`, '']
    .concat(wrong.map(q => {
      const r = getRec(q.questionId);
      return `## ${q.questionId}. ${TYPE_LABELS[q.type]}\n\n${stripMarkdownImages(q.stem)}\n\n- 错误次数：${r.wrongCount}\n- 待复习：${r.uncertain ? '是' : '否'}\n- 正确答案：${formatAnswer(q, q.answer)}\n`;
    })).join('\n');
  downloadBlob(new Blob([body], {type:'text/markdown;charset=utf-8'}), `通信电子线路_错题待复习_${dateStamp()}.md`);
}
function importRecords(e) {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const data = safeJSON(reader.result);
    if (!data || !data.items) { toast('导入失败：不是有效的学习记录 JSON。'); return; }
    records = { version: 1, courseId: 'communication_electronics', updatedAt: Date.now(), items: data.items || {} };
    saveRecords(); renderAllStats(); renderStatsPage(); toast('学习记录已导入。');
  };
  reader.readAsText(file);
  e.target.value = '';
}

function toggleTheme() { applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark'); }
function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  preferences.theme = theme; savePreferences();
  const btn = $('themeBtn'); if (btn) btn.textContent = theme === 'dark' ? '浅色' : '深色';
}

function normBlank(v) {
  return String(v ?? '')
    .trim()
    .toLowerCase()
    .replace(/[\s　]+/g, '')
    .replace(/[，,。．.]/g, '')
    .replace(/（/g,'(').replace(/）/g,')')
    .replace(/＜/g,'<').replace(/＞/g,'>')
    .replace(/khz/g,'khz').replace(/mhz/g,'mhz');
}
function renderMarkdown(md) {
  if (!md) return '';
  let html = escapeHTML(md);
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => `<img class="md-img" src="${escapeAttr(src)}" alt="${escapeAttr(alt || '题目图片/公式')}" loading="lazy">`);
  html = html.replace(/\$([^$\n]+)\$/g, (_, formula) => `<span class="math-inline">${formatFormula(formula)}</span>`);
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/`([^`]+)`/g, '<span class="kbd">$1</span>');
  html = html.replace(/\n/g, '<br>');
  return html;
}
function renderMarkdownInline(s) { return renderMarkdown(String(s || '')).replace(/<br>/g,' '); }
function stripMarkdownImages(s) { return String(s || '').replace(/!\[[^\]]*\]\([^)]+\)/g, '[图/公式]'); }
function formatFormula(formula) {
  return replaceLatexCommandWithOneArg(
    replaceLatexCommandWithOneArg(
      replaceLatexCommandWithTwoArgs(String(formula || ''), ['dfrac', 'frac'], (a, b) => `(${a})/(${b})`),
      'sqrt',
      value => `√(${value})`
    ),
    'mathrm',
    value => value
  )
    .replace(/\\cos/g, 'cos')
    .replace(/\\sin/g, 'sin')
    .replace(/\\pi/g, 'π')
    .replace(/\\omega/g, 'ω')
    .replace(/\\Omega/g, 'Ω')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\lambda/g, 'λ')
    .replace(/\\eta/g, 'η')
    .replace(/\\theta/g, 'θ')
    .replace(/\\approx/g, '≈')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\times/g, '×')
    .replace(/\\pm/g, '±')
    .replace(/\\,/g, ' ')
    .replace(/_\{([^{}]+)\}/g, '<sub>$1</sub>')
    .replace(/\^\{([^{}]+)\}/g, '<sup>$1</sup>')
    .replace(/_([A-Za-z0-9]+)/g, '<sub>$1</sub>')
    .replace(/\^([A-Za-z0-9]+)/g, '<sup>$1</sup>')
    .replace(/\\/g, '');
}
function replaceLatexCommandWithTwoArgs(text, names, render) {
  return replaceLatexCommand(text, names, 2, args => render(args[0], args[1]));
}
function replaceLatexCommandWithOneArg(text, name, render) {
  return replaceLatexCommand(text, [name], 1, args => render(args[0]));
}
function replaceLatexCommand(text, names, argCount, render) {
  let out = '';
  for (let i = 0; i < text.length;) {
    const name = names.find(n => text.startsWith(`\\${n}`, i));
    if (!name) {
      out += text[i++];
      continue;
    }
    let cursor = i + name.length + 1;
    const args = [];
    for (let a = 0; a < argCount; a++) {
      const parsed = parseLatexBracedArg(text, cursor);
      if (!parsed) break;
      args.push(parsed.value);
      cursor = parsed.end;
    }
    if (args.length !== argCount) {
      out += text[i++];
      continue;
    }
    out += render(args);
    i = cursor;
  }
  return out;
}
function parseLatexBracedArg(text, start) {
  if (text[start] !== '{') return null;
  let depth = 0;
  for (let i = start; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return { value: text.slice(start + 1, i), end: i + 1 };
    }
  }
  return null;
}
function escapeHTML(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeAttr(s) { return escapeHTML(s).replace(/`/g, '&#96;'); }
function badge(text, kind='') { return `<span class="badge ${kind}">${escapeHTML(text)}</span>`; }
function statCard(label, value) { return `<div class="stat"><b>${value}</b><span>${label}</span></div>`; }
function shuffle(arr) { return arr.map(v=>[Math.random(),v]).sort((a,b)=>a[0]-b[0]).map(x=>x[1]); }
function sortByWrong(arr) { return arr.sort((a,b)=> getRec(b.questionId).wrongCount - getRec(a.questionId).wrongCount || a.questionId - b.questionId); }
function safeJSON(s) { try { return s ? JSON.parse(s) : null; } catch { return null; } }
function toast(msg) { const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toast.timer); toast.timer=setTimeout(()=>t.classList.remove('show'), 2600); }
function downloadBlob(blob, filename) { const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 500); }
function dateStamp() { const d=new Date(); return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`; }
