'use strict';
// 出力の置換（ja.replace の連鎖）のどれが訳の一部を変えたかを調べる:
//   node tools/en/why-rep.js "文" "消えた（または現れた）文字列"
// 置換の前に その文字列を含み、後で含まなくなった（または逆の）replace の正規表現を表示する（vm の中の String.prototype を差し替える）。
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js']);
const syn = JK.en.syn;
const [s, needle] = process.argv.slice(2);
const SP = new syn.translate.constructor('return String.prototype')();   // vm の中の String.prototype
const orig = SP.replace;
const hits = [];
SP.replace = function (a, b) {
  const before = String(this);
  const after = orig.call(this, a, b);
  if (needle && before !== after && before.includes(needle) !== after.includes(needle)) hits.push({ re: String(a).slice(0, 200), before: before.slice(0, 120), after: after.slice(0, 120) });
  return after;
};
const t = syn.tokenize(s);
const r = syn.translate(t);
SP.replace = orig;
console.log(r && r.ok ? r.ja : '(null)');
hits.forEach((h) => console.log('---\n' + h.re + '\n  ' + h.before + '\n→ ' + h.after));
