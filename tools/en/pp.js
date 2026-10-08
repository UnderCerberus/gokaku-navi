'use strict';
// 段落を文に分けて訳す（アプリの JK.en.translate と同じ経路）: node tools/en/pp.js "段落1" ["段落2" …]
const load = require('./load.js');
const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js', 'js/english/grammar.js', 'js/english/translator.js']);
process.argv.slice(2).forEach((para) => {
  let r;
  try { r = JK.en.translate(para); } catch (e) { console.log('× ' + para + '\n   → error: ' + e.message); return; }
  (r && r.sentences || []).forEach((x) => console.log((x.method === 'pattern' ? '○ ' : '△ ') + x.en + '\n   → ' + x.ja + (x.method === 'pattern' ? '' : '   [' + x.method + ']')));
});
