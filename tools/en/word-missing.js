'use strict';
// 辞書にない語を調べる: node word-missing.js "word1 word2 …"（空白区切り。活用形は lemma で見る）
const load = require('./load.js');
const JK = load(['js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js']);
const words = JK.dict.words;
const miss = [];
process.argv.slice(2).join(' ').split(/\s+/).filter(Boolean).forEach((w) => {
  const k = w.toLowerCase();
  if (Object.prototype.hasOwnProperty.call(words, k)) return;
  let ok = false;
  try {
    const t = JK.en.syn.tokenize(k)[0];
    const an = JK.en.analyze ? JK.en.analyze(t ? t.w : k) : null;
    if (Array.isArray(an) && an.some((a) => a.entries && a.entries.length)) ok = true;
  } catch (e) { /* ignore */ }
  if (!ok) miss.push(k);
});
console.log(miss.length + ' missing: ' + miss.join(' '));
