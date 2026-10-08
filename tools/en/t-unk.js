'use strict';
// 内蔵長文のうち解析に失敗する文に含まれる、辞書にない語を数える: node t-unk.js [all]（all = 全文を対象）
const load = require('./load.js');
const FILES = ['js/data/passages-sample.js', 'js/data/exam-english-basic.js', 'js/data/exam-english-mid.js', 'js/data/exam-english-adv.js', 'js/data/drills-english.js',
  'js/data/seikei-english-2024.js', 'js/data/seikei-english-2025.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js'];
const JK = load(FILES);
const syn = JK.en.syn;
const all = [];
JK.passageList.forEach((p) => p.paras.forEach((para) => para.forEach((st) => all.push(JK.passage.plain(st.en)))));
const everything = process.argv[2] === 'all';
const cnt = {};
all.forEach((s) => {
  const toks = syn.tokenize(s);
  let r = null;
  try { r = syn.translate(toks); } catch (e) { r = null; }
  if (r && r.ok && !everything) return;
  toks.forEach((t) => {
    if (t.k !== 'w' || /^[0-9]/.test(t.w)) return;
    const an = JK.en.analyze(t.w);
    if (an.some((a) => a.entries.length > 0)) return;
    if (/^(?:a|an|the|and|or|but|of|to|in|on|at|for|with|by|from|as|that|this|these|those|it|its|he|she|they|we|you|i|his|her|their|our|my|your|is|are|was|were|be|been|being|not|no|so|if|than|then|there|here|what|which|who|whom|whose|when|where|why|how|one|ones|some|any|all|each|every|both|such|same|own|do|does|did|have|has|had|will|would|can|could|may|might|must|should|shall|us|them|him|me|s|t)$/.test(t.w)) return;
    cnt[t.w] = (cnt[t.w] || 0) + 1;
  });
});
const keys = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a] || (a < b ? -1 : 1));
console.log('辞書にない語 ' + keys.length + ' 種');
keys.forEach((k) => console.log('  ' + k + ' ×' + cnt[k]));
