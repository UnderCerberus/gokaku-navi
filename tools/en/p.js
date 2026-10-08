'use strict';
// 任意の英文を構文訳して表示: node p.js "文1|文2|…"（| 区切り。構文名も出す）
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js']);
const syn = JK.en.syn;
process.argv.slice(2).join(' ').split('|').forEach((s) => {
  s = s.trim();
  if (!s) return;
  const t = syn.tokenize(s);
  let r;
  try { r = syn.translate(t) || { ok: false, err: '(null)' }; } catch (e) { r = { ok: false, err: e.message }; }
  console.log((r.ok ? '○ ' : '× ') + s + '\n   → ' + (r.ok ? r.ja + '   [' + (r.names || []).join(',') + ']' : (r.err || syn.chunks(t).ja)));
});
