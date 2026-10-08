'use strict';
const load = require('./load.js');
const JK = load([]);
const W = JK.dict.words;
const mode = process.argv[2];
if (mode === 'w') {
  process.argv.slice(3).forEach((w) => {
    const e = W[w];
    console.log(w.padEnd(11), e ? e.map((x) => x.pos + ':' + x.ja + '(' + x.lv + ')').join(' | ') : '---');
  });
} else if (mode === 'idioms') {
  // 形の統計: プレースホルダーの種類
  const shapes = {};
  JK.dict.idioms.forEach((it) => {
    const sh = it.phrase.split(' ').map((t) => (/^(~|A|B|C|D|one's|oneself|do|doing|done|be)$/.test(t) ? t : 'w')).join(' ');
    (shapes[sh] = shapes[sh] || []).push(it.phrase + ' = ' + it.ja);
  });
  Object.keys(shapes).sort((a, b) => shapes[b].length - shapes[a].length).forEach((k) => {
    console.log(String(shapes[k].length).padStart(4), k, ' e.g. ', shapes[k].slice(0, 3).join(' / '));
  });
} else if (mode === 'grep') {
  const re = new RegExp(process.argv[3]);
  JK.dict.idioms.forEach((it) => { if (re.test(it.phrase)) console.log(it.phrase, '=', it.ja, '(' + it.lv + ')'); });
} else if (mode === 'pos') {
  // ある品詞の語義の語尾の分布
  const pos = process.argv[3];
  const tails = {};
  Object.keys(W).forEach((k) => W[k].forEach((e) => {
    if (e.pos !== pos) return;
    e.ja.split(';').forEach((s) => { s = s.trim(); const t = s.slice(-2); (tails[t] = tails[t] || []).push(k + ':' + s); });
  }));
  Object.keys(tails).sort((a, b) => tails[b].length - tails[a].length).slice(0, Number(process.argv[4] || 40)).forEach((t) => {
    console.log(String(tails[t].length).padStart(4), t, ' e.g. ', tails[t].slice(0, 4).join(' / '));
  });
}
