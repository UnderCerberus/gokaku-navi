'use strict';
// どのコードが name('…') を付けたか（訳の経路）を調べる: node tools/en/trace-name.js "文" "idiom"
// syntax.js の name() に呼び出し元の表示を差し込んだ写しで訳し、その名前が付くたびにスタックの先頭を表示する（syntax.js は書き換えない）
const fs = require('fs');
const path = require('path');
const [sent, tag] = process.argv.slice(2);
const root = path.join(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js/english/syntax.js'), 'utf8');
const old = "  const name = (s) => { if (NAMES.indexOf(s) < 0) NAMES.push(s); };";
if (src.split(old).length !== 2) { console.log('anchor not found'); process.exit(1); }
const inject = "  const name = (s) => { if (s === " + JSON.stringify(tag) + ") { const st = new Error().stack.split(String.fromCharCode(10)).slice(2, 6).map((x) => x.trim().replace(/\\(.*syntax[^:]*:/, '(L').slice(0, 60)); console.log('TRACE ' + st.join(' | ')); } if (NAMES.indexOf(s) < 0) NAMES.push(s); };";
const tmp = path.join(__dirname, '.trace-syntax.js');
fs.writeFileSync(tmp, src.replace(old, inject), 'utf8');
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
