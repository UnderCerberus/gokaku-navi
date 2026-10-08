'use strict';
// 一時的な観察（syntax.js は書き換えない。dbg-probe と違い throw しないので、try/catch の中や何度も通る場所も見られる）:
//   node tools/en/dbg-log.js "文" "syntax.js 内の目印の文字列（1 か所だけ）" "記録する JS 式" ["条件の JS 式"]
// 目印の直前に「条件が真なら式の値を console.log する」を差し込んだ写しを、辞書も含めて読み込んで訳し、記録と訳を表示する。
const fs = require('fs');
const path = require('path');
const [sent, anchor, expr, cond] = process.argv.slice(2);
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js/english/syntax.js'), 'utf8');
const n = src.split(anchor).length - 1;
if (n !== 1) { console.log('anchor count', n); process.exit(1); }
const inject = 'if (' + (cond || 'true') + ') { try { console.log("DBGLOG " + JSON.stringify(' + expr + ').slice(0, 800)); } catch (eDbg) { console.log("DBGLOG ERR " + eDbg.message); } }\n';
const tmp = path.join(__dirname, '.dbg-log-syntax.js');
fs.writeFileSync(tmp, src.replace(anchor, inject + anchor), 'utf8');
try {
  const load = require('./load.js');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
    .filter((f) => /^js\/data\/|^js\/english\//.test(f) && f !== 'js/data/seikei-english-2023.js')
    .map((f) => (f === 'js/english/syntax.js' ? tmp : f));
  const JK = load(files);
  const r = JK.en.translate(sent);
  console.log('result:', r.sentences.map((x) => x.ja).join(' / '));
} finally {
  fs.unlinkSync(tmp);
}
