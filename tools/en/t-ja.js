'use strict';
const load = require('./load.js');
const JK = load(['js/english/lemma.js', 'js/english/ja.js']);
const jp = JK.en.jp, P = jp.P;
const mode = process.argv[2] || 'forms';
if (mode === 'forms') {
  ['学ぶ', '勉強する', '行く', '来る', '持ってくる', '見る', '食べる', '走る', '帰る', '知る', '話す', '待つ', '死ぬ', '飲む', '泳ぐ', '買う', '作る', '信じる', '混じる', 'できる', 'ある', 'である', '好きだ', 'ほしい', '高い', 'いい', '愛する', '訳する', '住む', '壊す', '起きる', '考える', '切る', '着る', '寝る', '出る', '得る', '似る', '入る', '要る', '減る', 'しゃべる', '思う', '言う', '問う', '降る', '乗る', '座る', '終わる', '分かる', '始まる', '生まれる', '感じる', '閉じる', '用いる', '試みる', '見える']
    .forEach((v) => {
      const p = P(v);
      console.log(v.padEnd(6, '　'), p.cls.padEnd(4), ['past', 'te', 'neg', 'stem', 'ba', 'vol', 'pass', 'caus'].map((f) => p.form(f)).join(' / '),
        '|', p.end({ polite: true }), p.end({ polite: true, past: true }), p.end({ polite: true, neg: true }), '|', p.aux('must').s, p.aux('may').s, p.aux('should').s);
    });
} else if (mode === 'ru') {
  // 辞書の動詞語義のうち る で終わるものの分類
  const W = JK.dict.words, v1 = new Set(), v5 = new Set();
  Object.keys(W).forEach((k) => W[k].forEach((e) => {
    if (e.pos !== '動') return;
    jp.senses(e.ja).forEach((s) => {
      if (!/る$/.test(s.core) || /する$/.test(s.core) || s.frame) return;
      const c = jp.classify(s.core);
      (c === 'v1' ? v1 : c === 'v5' ? v5 : new Set()).add(s.core);
    });
  }));
  const pick = (set, re) => Array.from(set).filter((x) => re.test(x));
  console.log('v5 かな(い/え段)+る:', pick(v5, /[いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ]る$/).join(' '));
  console.log('v1 漢字+る:', pick(v1, /[一-鿿]る$/).join(' '));
  console.log('v5 漢字+る (' + pick(v5, /[一-鿿]る$/).length + '):', pick(v5, /[一-鿿]る$/).slice(0, 400).join(' '));
  console.log('v1 count', v1.size, 'v5 count', v5.size);
  console.log('v5 その他 かな+る:', pick(v5, /[ぁ-ん]る$/).filter((x) => !/[いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ]る$/.test(x)).slice(0, 300).join(' '));
} else if (mode === 'adj') {
  const W = JK.dict.words, kinds = {};
  Object.keys(W).forEach((k) => W[k].forEach((e) => {
    if (e.pos !== '形') return;
    const a = jp.adj(e.ja);
    (kinds[a.kind] = kinds[a.kind] || []).push(k + ':' + a.attr + '→' + a.pred.s + (a.stem ? '' : ''));
  }));
  Object.keys(kinds).forEach((k) => console.log(k, kinds[k].length, kinds[k].filter((_, i) => i % Math.ceil(kinds[k].length / 40) === 0).join(' | ')));
} else if (mode === 'tail') {
  // 動詞語義の分類のうち想定外のもの
  const W = JK.dict.words, odd = [];
  Object.keys(W).forEach((k) => W[k].forEach((e) => {
    if (e.pos !== '動') return;
    jp.senses(e.ja).forEach((s) => {
      const c = jp.classify(s.core);
      if (c === 'n' || c === 'i' || c === 'da' || s.frame) odd.push(k + ':' + s.raw + '[' + c + (s.frame ? ',frame' : '') + ']');
    });
  }));
  console.log(odd.length, odd.join(' | '));
}
