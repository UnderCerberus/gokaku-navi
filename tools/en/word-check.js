'use strict';
// 辞書にない語の洗い出し: node tools/en/word-check.js "word word …"（空白区切り。活用形は見出し語に戻して引く）
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js']);
const words = process.argv.slice(2).join(' ').toLowerCase().split(/\s+/).filter(Boolean);
const miss = [];
for (const w of words) {
  const forms = [w, w.replace(/ies$/, 'y'), w.replace(/es$/, ''), w.replace(/s$/, '')];
  const hit = forms.some((f) => { const h = JK.en.lookup(f); return h && h.length; });
  if (!hit) miss.push(w);
}
console.log(miss.length ? miss.join(' ') : '（すべて辞書にある）');
