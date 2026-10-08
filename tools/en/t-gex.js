'use strict';
// 文法ポイントの例文（grammar.js の example）を構文訳して、参考訳と並べる: node t-gex.js [all]（all = 一致したものも出す）
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js']);
const syn = JK.en.syn;
const pats = JK.grammar || [];
const all = process.argv[2] === 'all';
let n = 0, ok = 0, same = 0;
pats.forEach((p) => {
  if (!p.example || !p.example.en) return;
  n++;
  const toks = syn.tokenize(p.example.en);
  let r = null;
  try { r = syn.translate(toks); } catch (e) { r = null; }
  if (r && r.ok) ok++;
  const ja = r && r.ok ? r.ja : '×' + syn.chunks(toks).ja;
  const hit = r && r.ok && r.ja === p.example.ja;
  if (hit) same++;
  if (all || !hit) console.log((r && r.ok ? '○ ' : '× ') + p.name + ' | ' + p.example.en + '\n    訳: ' + ja + '\n    参: ' + p.example.ja);
});
console.log('\n例文 ' + n + ' / 解析 ' + ok + ' / 参考訳と完全一致 ' + same + '（パターン数 ' + pats.length + '）');
