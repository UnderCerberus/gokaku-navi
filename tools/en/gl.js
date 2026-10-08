'use strict';
// 語注（gloss）の確認: node gl.js "文1|文2|…" → 訳と、語ごとの 表記 = 見出し語 / 訳
// 書き換え（呼びかけ・P.S. など）で語注が別の語にずれていないかを見る
const fs = require('fs');
const path = require('path');
const load = require('./load.js');
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
  .filter((f) => /^js\/data\/|^js\/english\/(lemma|ja|syntax|grammar|translator)\.js$/.test(f) && !/dict-|idioms|units/.test(f) && f !== 'js/data/seikei-english-2023.js');
const JK = load(files);
process.argv.slice(2).join(' ').split('|').forEach((s) => {
  s = s.trim();
  if (!s) return;
  const r = JK.en.translate(s);
  (r.sentences || []).forEach((x) => {
    console.log(x.en + '\n   → ' + x.ja);
    const bad = x.gloss.filter((g) => g.w.toLowerCase().replace(/[^a-z]/g, '').slice(0, 2) !== String(g.lemma).toLowerCase().replace(/[^a-z]/g, '').slice(0, 2));
    console.log('   ' + x.gloss.map((g) => g.w + '=' + g.lemma + '/' + String(g.ja).split(';')[0]).join('  ') + (bad.length ? '   ★ずれ? ' + bad.map((g) => g.w + '=' + g.lemma).join(' ') : ''));
  });
});
