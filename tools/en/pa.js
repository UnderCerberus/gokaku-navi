'use strict';
// アプリ本体の経路（JK.en.translate: 翻訳メモリ exact / fuzzy → 構文エンジン）で訳を確認する
// p.js は構文エンジン直呼びなので、画面に出る訳とは違うことがある
// 使い方: node tools/en/pa.js "文|文"
const fs = require('fs');
const path = require('path');
const load = require('./load.js');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
  .filter((f) => /^js\/data\/|^js\/english\/(lemma|ja|syntax|grammar|translator)\.js$/.test(f) && !/dict-|idioms|units/.test(f) && f !== 'js/data/seikei-english-2023.js');
const JK = load(files);
const en = JK.en;
(process.argv[2] || '').split('|').filter(Boolean).forEach((s) => {
  const r = en.translate(s);
  r.sentences.forEach((x) => {
    console.log('[' + x.method + (x.score != null && x.method === 'fuzzy' ? ' ' + x.score : '') + '] ' + s);
    console.log('  ' + x.ja + (x.source && x.method !== 'exact' ? '\n  出典: ' + x.source : ''));
  });
});
