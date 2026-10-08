'use strict';
// 内蔵長文のうち、構文解析だけでは訳せない文を短い順に並べる: node t-fail.js [件数] [開始位置]
const load = require('./load.js');
const FILES = ['js/data/passages-sample.js', 'js/data/exam-english-basic.js', 'js/data/exam-english-mid.js', 'js/data/exam-english-adv.js', 'js/data/drills-english.js',
  'js/data/seikei-english-2024.js', 'js/data/seikei-english-2025.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js'];
const JK = load(FILES);
const syn = JK.en.syn;
const all = [];
JK.passageList.forEach((p) => p.paras.forEach((para) => para.forEach((st) => all.push({ en: JK.passage.plain(st.en), ja: st.ja, pid: p.id }))));
const fails = [];
let ok = 0, slow = 0;
all.forEach((s) => {
  const toks = syn.tokenize(s.en);
  const t0 = Date.now();
  let r = null;
  try { r = syn.translate(toks); } catch (e) { r = null; s.err = e.message; }
  const ms = Date.now() - t0;
  if (ms > 100) slow++;
  if (r && r.ok) ok++; else fails.push(Object.assign(s, { n: toks.filter((t) => t.k === 'w').length || s.en.split(/\s+/).length }));
});
fails.sort((a, b) => a.n - b.n);
const N = Number(process.argv[2] || 40), from = Number(process.argv[3] || 0);
console.log('文 ' + all.length + ' / 解析できた ' + ok + '（' + (100 * ok / all.length).toFixed(1) + '%）/ 失敗 ' + fails.length + ' / 100ms 超 ' + slow);
fails.slice(from, from + N).forEach((f) => console.log('× [' + f.n + '] ' + f.en + (f.err ? '  !! ' + f.err : '')));
