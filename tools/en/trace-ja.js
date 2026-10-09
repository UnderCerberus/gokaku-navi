'use strict';
// 出力の正規化（ja = ja.replace(…) の行）のどこで訳が変わったかを調べる: node tools/en/trace-ja.js "文" [開始行] [終了行]
// syntax.js の写しの「    ja = ja.replace(」で始まる各行の後ろに、訳が変わったら行番号と前後を表示する処理を差し込んで訳す（syntax.js は書き換えない）
const fs = require('fs');
const path = require('path');
const [sent, fromS, toS] = process.argv.slice(2);
const root = path.join(__dirname, '..', '..');
const lines = fs.readFileSync(path.join(root, 'js/english/syntax.js'), 'utf8').split('\n');
const from = Number(fromS || 1), to = Number(toS || lines.length);
const out = [];
let n = 0;
lines.forEach((l, k) => {
  const ln = k + 1;
  if (ln >= from && ln <= to && /^    ja = ja\.replace\(/.test(l) && /;\s*(?:\/\/.*)?$/.test(l)) {
    out.push('{ const __b = ja;');
    out.push(l);
    out.push('if (__b !== ja) console.log("JA L' + ln + ': " + __b + "  →  " + ja); }');
    n++;
  } else out.push(l);
});
const tmp = path.join(__dirname, '.trace-ja-syntax.js');
fs.writeFileSync(tmp, out.join('\n'), 'utf8');
try {
  const load = require('./load.js');
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
    .filter((f) => /^js\/data\/|^js\/english\//.test(f) && f !== 'js/data/seikei-english-2023.js')
    .map((f) => (f === 'js/english/syntax.js' ? tmp : f));
  const JK = load(files);
  const r = JK.en.translate(sent);
  console.log('lines instrumented:', n);
  console.log('result:', r.sentences.map((x) => x.ja).join(' / '));
} finally {
  fs.unlinkSync(tmp);
}
