'use strict';
// 解析に失敗する文を、表面的な特徴で分類して数える: node t-cat.js [特徴名]（特徴名を付けるとその文を列挙）
const load = require('./load.js');
const FILES = ['js/data/passages-sample.js', 'js/data/exam-english-basic.js', 'js/data/exam-english-mid.js', 'js/data/exam-english-adv.js', 'js/data/drills-english.js',
  'js/data/seikei-english-2024.js', 'js/data/seikei-english-2025.js', 'js/english/lemma.js', 'js/english/ja.js', 'js/english/syntax.js'];
const JK = load(FILES);
const syn = JK.en.syn;
const all = [];
JK.passageList.forEach((p) => p.paras.forEach((para) => para.forEach((st) => all.push(JK.passage.plain(st.en)))));
const CATS = {
  quote: (s) => /["“”]/.test(s),
  semicolon: (s) => /;/.test(s),
  colon: (s) => /:/.test(s),
  dash: (s) => /[—–]| - /.test(s),
  paren: (s) => /[()]/.test(s),
  however: (s) => /, (however|though|therefore|for example|in fact|of course|too|either)[,.]/i.test(s),
  list3: (s) => /\w+, \w+(?: \w+)?,? (and|or) /.test(s),
  question: (s) => /\?/.test(s),
  long25: (s) => s.split(/\s+/).length >= 25,
  short10: (s) => s.split(/\s+/).length <= 10
};
const want = process.argv[2];
const cnt = {}, tot = {};
let fail = 0;
const picked = [];
all.forEach((s) => {
  let r = null;
  try { r = syn.translate(syn.tokenize(s)); } catch (e) { r = null; }
  const ok = !!(r && r.ok);
  if (!ok) fail++;
  let any = false;
  Object.keys(CATS).forEach((k) => {
    if (!CATS[k](s)) return;
    any = true;
    tot[k] = (tot[k] || 0) + 1;
    if (!ok) { cnt[k] = (cnt[k] || 0) + 1; if (k === want) picked.push(s); }
  });
  if (!any) { tot.plain = (tot.plain || 0) + 1; if (!ok) { cnt.plain = (cnt.plain || 0) + 1; if (want === 'plain') picked.push(s); } }
});
console.log('文 ' + all.length + ' / 失敗 ' + fail);
Object.keys(tot).sort((a, b) => (cnt[b] || 0) - (cnt[a] || 0)).forEach((k) => console.log('  ' + k + ': 失敗 ' + (cnt[k] || 0) + ' / ' + tot[k]));
picked.forEach((s) => console.log('× ' + s));
