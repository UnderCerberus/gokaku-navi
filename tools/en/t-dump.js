'use strict';
// 内蔵長文（全ファイル）の文と構文解析だけの訳を並べて出す: node t-dump.js [開始] [件数]   例: node t-dump.js 350 70
const load = require('./load.js');
const FILES = ['js/data/passages-sample.js', 'js/data/exam-english-basic.js', 'js/data/exam-english-mid.js', 'js/data/exam-english-adv.js', 'js/data/drills-english.js',
  'js/data/seikei-english-2024.js', 'js/data/seikei-english-2025.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js'];
const JK = load(FILES);
const syn = JK.en.syn;
const all = [];
JK.passageList.forEach((p) => p.paras.forEach((para) => para.forEach((st) => all.push({ en: JK.passage.plain(st.en), pid: p.id }))));
const from = Number(process.argv[2] || 0), n = Number(process.argv[3] || 70);
all.slice(from, from + n).forEach((s, k) => {
  const toks = syn.tokenize(s.en);
  let r = null;
  try { r = syn.translate(toks); } catch (e) { r = null; }
  console.log((from + k) + ' ' + (r && r.ok ? '○' : '×') + ' ' + s.en + '\n    → ' + (r && r.ok ? r.ja : syn.chunks(toks).ja));
});
console.log('(全 ' + all.length + ' 文)');
