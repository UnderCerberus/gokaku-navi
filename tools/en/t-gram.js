'use strict';
// 文法ポイントと熟語検出の点検: t-syn.js のテスト文すべてについて、検出された文法ポイント（文型以外）と熟語を出す
const fs = require('fs');
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js', 'js/english/translator.js']);
const src = fs.readFileSync(__dirname + '/t-syn.js', 'utf8');
const body = src.slice(src.indexOf('const CORE'), src.indexOf('function show'));
const sents = [];
const re = /'((?:[^'\\]|\\.)+)'|"((?:[^"\\]|\\.)+)"/g;
let m;
while ((m = re.exec(body))) { const s = (m[1] || m[2]).replace(/\\'/g, "'"); if (/[.?!]$/.test(s)) sents.push(s); }
const extra = process.argv.slice(2);
const count = {};
(extra.length ? extra : sents).forEach((s) => {
  const r = JK.en.translate(s);
  const st = r.sentences[0];
  const gs = st.grammar.map((x) => x.name.replace(/（.*$/, ''));
  gs.forEach((g) => { count[g] = (count[g] || 0) + 1; });
  console.log(s + '\n    G: ' + gs.filter((x) => !/^第/.test(x)).join(' / ') + (r.idioms.length ? '\n    I: ' + r.idioms.map((x) => x.phrase).join(' | ') : ''));
});
console.log('\n検出数:', Object.keys(count).sort((a, b) => count[b] - count[a]).map((k) => k + '=' + count[k]).join(', '));
console.log('一度も検出されなかったパターン:', JK.grammar.map((g) => g.name.replace(/（.*$/, '')).filter((n) => !count[n]).join(' / '));
