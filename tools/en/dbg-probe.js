'use strict';
// 一時的な観察（syntax.js は書き換えない）:
//   node tools/en/dbg-probe.js "文" "syntax.js 内の目印の文字列（1 か所だけ）" "表示する JS 式" ["条件の JS 式"]
// 目印の直前に「条件が真なら throw new Error('DBG ' + 式)」を差し込んだ写しを読み込んで訳す。
const fs = require('fs');
const path = require('path');
const [sent, anchor, expr, cond] = process.argv.slice(2);
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js/english/syntax.js'), 'utf8');
const n = src.split(anchor).length - 1;
if (n !== 1) { console.log('anchor count', n); process.exit(1); }
const inject = 'if (' + (cond || 'true') + ') throw new Error("DBG " + JSON.stringify(' + expr + '));\n';
const tmp = path.join(__dirname, '.dbg-syntax.js');
fs.writeFileSync(tmp, src.replace(anchor, inject + anchor), 'utf8');
try {
  const load = require('./load.js');
  const JK = load(['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js', tmp, 'js/english/grammar.js']);
  const syn = JK.en.syn;
  const origWarn = console.warn;
  let caught = null;
  console.warn = (...a) => { const m = a.map(String).join(' '); const k = m.indexOf('DBG '); if (k >= 0 && !caught) caught = m.slice(k, k + 3000); };
  let r = null;
  try { r = syn.translate(syn.tokenize(sent)); } catch (e) { const m = String(e && e.message); if (!caught && m.indexOf('DBG ') >= 0) caught = m.slice(m.indexOf('DBG '), m.indexOf('DBG ') + 3000); else if (!caught) caught = 'error: ' + m; }
  console.warn = origWarn;
  console.log(caught || ('no DBG; result: ' + (r && r.ja)));
} finally {
  fs.unlinkSync(tmp);
}
