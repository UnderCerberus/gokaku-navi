'use strict';
// 人名の訳の洗い出し: node tools/en/name-check.js "Kenta Emma Brown …"（空白区切り）
// 「X is my friend.」を訳して、英字が残る名前（NAME_JA / PN にない名前）だけを表示する
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js']);
const syn = JK.en.syn;
const names = process.argv.slice(2).join(' ').split(/\s+/).filter(Boolean);
const out = [];
for (const n of names) {
  const r = syn.translate(syn.tokenize(n + ' is my friend.'));
  const ja = r && r.ok ? r.ja : '(null)';
  if (/[A-Za-z]/.test(ja) || ja === '(null)') out.push(n + '\t' + ja);
}
console.log(out.length ? out.join('\n') : '（すべて訳せた）');
