'use strict';
// 未見文（held-out）の訳を、画面と同じ経路で一覧にする: node tools/en/ho.js tools/en/heldout/batch1.txt [開始番号] [件数]
// 回帰文（t-syn.js）にすでにある文には「既出」と付ける（未見文の測定から外すため）
const fs = require('fs');
const path = require('path');
const load = require('./load.js');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
  .filter((f) => /^js\/data\/|^js\/english\/(lemma|ja|syntax|grammar|translator)\.js$/.test(f) && !/dict-|idioms|units/.test(f) && f !== 'js/data/seikei-english-2023.js');
const JK = load(files);
const en = JK.en;
const synSrc = fs.readFileSync(path.join(__dirname, 't-syn.js'), 'utf8');
const lines = fs.readFileSync(process.argv[2], 'utf8').split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
const from = Number(process.argv[3] || 1), cnt = Number(process.argv[4] || lines.length);
const tally = {};
lines.forEach((s, i) => {
  if (i + 1 < from || i + 1 >= from + cnt) return;
  const seen = synSrc.indexOf(s) >= 0 || synSrc.indexOf(s.replace(/"/g, '\\"')) >= 0;
  const r = en.translate(s);
  const x = r.sentences.length === 1 ? r.sentences[0] : { method: 'split' + r.sentences.length, ja: r.sentences.map((y) => y.ja).join(' ') };
  tally[x.method] = (tally[x.method] || 0) + 1;
  console.log((i + 1) + '. [' + x.method + (seen ? ' 既出' : '') + '] ' + s + '\n   ' + x.ja);
});
console.log(JSON.stringify(tally));
