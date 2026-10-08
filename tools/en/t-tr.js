'use strict';
// JK.en.translate / makeVocabQuiz の検証
const fs = require('fs');
const path = require('path');
const load = require('./load.js');
// index.html の読み込み順のうち、データと英語エンジンを全部読む
const html = fs.readFileSync(path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const files = (html.match(/<script src="([^"]+)"/g) || []).map((x) => x.replace(/<script src="|"/g, ''))
  .filter((f) => /^js\/data\/|^js\/english\/(lemma|ja|syntax|grammar|translator)\.js$/.test(f) && !/dict-|idioms|units/.test(f) && f !== 'js/data/seikei-english-2023.js');
const JK = load(files);
const en = JK.en;
let fail = 0, n = 0;
const ok = (cond, msg) => { n++; if (!cond) { fail++; console.log('NG ' + msg); } };
const mode = process.argv[2] || 'all';

if (mode === 'all' || mode === 'tm') {
  // 翻訳メモリ: 1 文・3 文・1 語違い
  const p = JK.passageList.filter((x) => x.id === 'ep-mid-01')[0] || JK.passageList[0];
  const sents = [];
  p.paras.forEach((para) => para.forEach((st) => sents.push(st)));
  const s1 = JK.passage.plain(sents[0].en);
  let r = en.translate(s1);
  ok(r.sentences.length === 1 && r.sentences[0].method === 'exact' && r.sentences[0].ja === sents[0].ja, 'TM 1 文 exact: ' + JSON.stringify(r.sentences[0]).slice(0, 200));
  const s3 = sents.slice(1, 4).map((st) => JK.passage.plain(st.en)).join(' ');
  r = en.translate(s3);
  ok(r.sentences.length === 3 && r.sentences.every((x, i) => x.method === 'exact' && x.ja === sents[1 + i].ja), 'TM 3 文 exact: ' + r.sentences.map((x) => x.method).join(','));
  // 1 語違い（長めの文の内容語を 1 つ変える）
  const long = sents.filter((st) => JK.passage.plain(st.en).split(' ').length >= 12)[0];
  const words = JK.passage.plain(long.en).split(' ');
  const NEG = /^(?:hardly|without|nothing|nobody|neither|little|cannot|never)$/;
  let k = -1;
  words.forEach((w, i) => { if (i > 2 && /^[a-z]{5,}$/.test(w) && !NEG.test(w)) k = i; });
  // 知っている語が違う文は、エンジンの訳を出し、似た内蔵文は参考（ref）に添える（解析できない文だけ内蔵文の訳 = fuzzy）
  const changed = words.slice(); changed[k] = 'remarkable';
  r = en.translate(changed.join(' '));
  const synOk = (x) => { try { const t = en.syn.translate(en.syn.tokenize(x)); return !!(t && t.ok); } catch (e) { return false; } };
  const r1 = r.sentences[0];
  if (synOk(changed.join(' '))) ok(r1.method !== 'fuzzy' && r1.ja !== long.ja && r1.ref && r1.ref.ja === long.ja && r1.ref.score >= 0.8 && r1.ref.score < 1, 'TM 1 語違いはエンジンの訳＋参考: ' + r1.method + ' ' + JSON.stringify(r1.ref || null).slice(0, 80));
  else ok(r1.method === 'fuzzy' && r1.score >= 0.8 && r1.score < 1, 'TM 1 語違い（解析できない文）は fuzzy: ' + r1.method + ' ' + r1.score);
  console.log('  1 語違いの例:', changed.join(' ').slice(0, 90), '→', r1.method, '|', String(r1.ja).slice(0, 60));
  // つづりの誤りだけの文は、内蔵文の訳（fuzzy）
  const swap = (w) => { for (let i = 1; i + 1 < w.length; i++) if (w[i] !== w[i + 1]) return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2); return w + 'x'; };
  const typo = words.slice(); typo[k] = swap(words[k]);
  r = en.translate(typo.join(' '));
  ok(r.sentences[0].method === 'fuzzy' && r.sentences[0].ja === long.ja && !r.sentences[0].ref, 'TM つづり誤りは fuzzy: ' + typo[k] + ' ' + r.sentences[0].method);
  // 前の文に合わせた応答: Would you mind …? → Not at all. は「いいですよ」（どういたしまして ではない）
  r = en.translate('"Would you mind opening the window?" "Not at all."');
  ok(r.sentences.length === 2 && /いいですよ/.test(r.sentences[1].ja), 'Not at all（mind への応答）: ' + r.sentences.map((x) => x.ja).join(' / '));
  r = en.translate('Thank you very much. Not at all.');
  ok(r.sentences.length === 2 && /どういたしまして/.test(r.sentences[1].ja), 'Not at all（お礼への応答）: ' + r.sentences.map((x) => x.ja).join(' / '));
  // 否定を足した文は fuzzy にしない
  const negd = words.slice(); negd.splice(k, 0, 'not');
  r = en.translate(negd.join(' '));
  ok(r.sentences[0].method !== 'fuzzy' && r.sentences[0].method !== 'exact', '否定語が増えた文は fuzzy にしない: ' + r.sentences[0].method);
  // 全長文の全文が exact になる
  let total = 0, exact = 0;
  JK.passageList.forEach((pp) => pp.paras.forEach((para) => para.forEach((st) => {
    total++;
    const rr = en.translate(JK.passage.plain(st.en));
    if (rr.sentences.length === 1 && rr.sentences[0].method === 'exact') exact++;
    else if (total - exact <= 5) console.log('  非 exact:', pp.id, JSON.stringify(JK.passage.plain(st.en)).slice(0, 110), '→', rr.sentences.length, rr.sentences.map((x) => x.method).join(','));
  })));
  console.log('  内蔵長文の文: ' + exact + ' / ' + total + ' が 1 文で exact');
  // 長文まるごと
  const t0 = Date.now();
  const whole = p.paras.map((para) => para.map((st) => JK.passage.plain(st.en)).join(' ')).join('\n\n');
  r = en.translate(whole);
  console.log('  長文 1 本（' + r.sentences.length + ' 文）: ' + (Date.now() - t0) + ' ms, exact ' + r.sentences.filter((x) => x.method === 'exact').length + ', vocab ' + r.vocab.length + ', idioms ' + r.idioms.length);
  ok(r.sentences.filter((x) => x.method === 'exact').length >= r.sentences.length - 1, '長文まるごとの exact 数');
}

if (mode === 'all' || mode === 'shape') {
  const text = 'It is important for us to learn English. There are many books on the desk. He is so tired that he cannot walk. ' +
    'This problem is too difficult for me to solve. She is not only kind but also smart. If I had more time, I would travel abroad. ' +
    'The window was broken by the boy. He is taller than his father. I have lived in Tokyo for ten years. She gave me a book. ' +
    'The boy plays tennis every day. My mother made me clean the room. The man who lives next door is a doctor. ' +
    'Although it was raining, they went out. Scientists believe that the climate is changing rapidly. Reading books is fun.';
  const r = en.translate(text);
  ok(r.sentences.length === 16, '16 文に分かれる: ' + r.sentences.length);
  r.sentences.forEach((s) => {
    ok(typeof s.en === 'string' && typeof s.ja === 'string' && s.ja.length > 0, 'ja がある: ' + s.en);
    ok(['exact', 'fuzzy', 'pattern', 'gloss'].indexOf(s.method) >= 0, 'method: ' + s.method);
    ok(Array.isArray(s.gloss) && s.gloss.every((x) => x.w && x.lemma && x.pos && x.ja), 'gloss の形: ' + s.en);
    ok(Array.isArray(s.grammar) && s.grammar.every((x) => x.name && x.explain), 'grammar の形: ' + s.en);
    console.log('  [' + s.method + '] ' + s.en + '\n      ' + s.ja + '\n      文法: ' + s.grammar.map((x) => x.name).join(' / ') + '\n      語注: ' + s.gloss.map((x) => x.w + '=' + x.ja.split(';')[0]).join(', ').slice(0, 150));
  });
  ok(r.vocab.every((v) => v.w && v.pos && v.ja && v.lv >= 1), 'vocab の形とレベル');
  ok(r.idioms.every((v) => v.phrase && v.ja), 'idioms の形');
  console.log('  vocab:', r.vocab.map((v) => v.w + '(' + v.lv + ')').join(' '));
  console.log('  idioms:', r.idioms.map((v) => v.phrase).join(' | '));
  // 変な入力でも落ちない
  ['', '   ', '!!!', 'a', '12345', 'こんにちは', 'Mr. Smith went to Washington, D.C. at 5 p.m. He said, "Hello!"', 'x'.repeat(5000), 'the the the the', "I'm don't can't won't it's"].forEach((t) => {
    let res = null, err = null;
    try { res = en.translate(t); } catch (e) { err = e; }
    ok(!err && res && Array.isArray(res.sentences), '例外なし: ' + JSON.stringify(t.slice(0, 30)) + (err ? ' ' + err.message : ''));
  });
}

if (mode === 'all' || mode === 'quiz') {
  const q1 = en.makeVocabQuiz({ level: 2, count: 5, seed: 42 });
  const q2 = en.makeVocabQuiz({ level: 2, count: 5, seed: 42 });
  const q3 = en.makeVocabQuiz({ level: 2, count: 5, seed: 43 });
  ok(q1.length === 5, 'クイズ 5 問: ' + q1.length);
  ok(JSON.stringify(q1) === JSON.stringify(q2), 'seed が同じなら同じ問題');
  ok(JSON.stringify(q1) !== JSON.stringify(q3), 'seed が違えば違う問題');
  const pos = [0, 0, 0, 0];
  let items = 0;
  for (let lv = 1; lv <= 3; lv++) {
    for (let seed = 1; seed <= 80; seed++) {
      en.makeVocabQuiz({ level: lv, count: 5, seed: seed }).forEach((q) => {
        items++;
        const p = q.parts[0];
        ok(q.title === '単語クイズ' && typeof q.word === 'string' && q.word && typeof q.body === 'string', 'クイズの形 ' + q.word);
        ok(p.type === 'choice' && p.choices.length === 4 && new Set(p.choices).size === 4, '4 択で重複なし: ' + q.word + ' ' + JSON.stringify(p.choices));
        ok(p.answer >= 0 && p.answer < 4 && typeof p.explain === 'string' && p.explain, 'answer / explain: ' + q.word);
        ok(Array.isArray(q.solution) && q.solution.length >= 2 && q.solution.every((s) => s.n || s.m), 'solution 2 ステップ以上: ' + q.word);
        const es = JK.dict.words[q.word];
        ok(es && es.some((e) => e.ja === p.choices[p.answer]), '正解が辞書の語義: ' + q.word);
        // リッチテキストの検査
        [q.body, p.explain].concat(p.choices, q.solution.map((s) => s.n || '')).forEach((t) => {
          const errs = JK.richCheck ? JK.richCheck(t) : [];
          ok(!errs.length, 'リッチテキスト: ' + q.word + ' ' + JSON.stringify(errs).slice(0, 100));
        });
        pos[p.answer]++;
      });
    }
  }
  console.log('  クイズ ' + items + ' 問、正解位置の分布: ' + pos.join(' / '));
  ok(Math.min.apply(null, pos) > items * 0.18, '正解位置が偏らない');
  // words 指定
  const qw = en.makeVocabQuiz({ words: ['abandon', 'studied', 'xyzzy', 'climate', 'Rapidly'], level: 1, count: 5, seed: 3 });
  ok(qw.length === 4 && qw.every((q) => ['abandon', 'study', 'climate', 'rapidly'].indexOf(q.word) >= 0), 'words 指定: ' + qw.map((q) => q.word).join(','));
  ok(en.makeVocabQuiz({ words: ['xyzzy'], level: 1, count: 5, seed: 3 }).length === 0, '辞書にない語だけなら 0 問');
  console.log('  例:', JSON.stringify(q1[0]).slice(0, 600));
}

console.log('\n' + (n - fail) + ' / ' + n + ' ok');
process.exit(fail ? 1 : 0);
