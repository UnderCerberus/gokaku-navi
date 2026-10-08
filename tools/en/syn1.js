'use strict';
// 構文エンジン単体（translateParts の分割の前に translate1 が文全体を読めるか）: node tools/en/syn1.js "文"
const fs = require('fs');
const path = require('path');
const load = require('./load.js');
const root = path.join(__dirname, '..', '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, '')).filter((f) => /^js\/data\/|^js\/english\//.test(f) && f !== 'js/data/seikei-english-2023.js');
const JK = load(files);
const syn = JK.en.syn;
for (const s of process.argv.slice(2)) {
  const toks = syn.tokenize(s);
  const r1 = syn.translate1 ? syn.translate1(toks) : null;
  const r = syn.translate(syn.tokenize(s));
  console.log(s, '\n  translate1:', r1 ? r1.ja : '(no export)', '\n  translate :', r && r.ja, r && r.names);
}
