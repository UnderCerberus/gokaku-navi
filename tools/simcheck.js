#!/usr/bin/env node
/* 物理シミュレーターの乱数演習（exercise）の点検。
   node tools/simcheck.js            : 全シミュレーター × 3 レベルの一覧（気になるものだけ）
   node tools/simcheck.js <simId>    : そのシミュレーターの詳細（例つき）
   node tools/simcheck.js all 400    : 種の数を変える（既定 200）
   node tools/simcheck.js --static   : 固定の問題（問題バンク）の解説について 4. だけを見る

   見るもの
   1. 通り数: 種を変えたとき、題名 + 全設問の答えの組が何通り出るか（少ないと「毎回同じ問題」になる。目安 12 通り以上）
   2. ずれ  : 数値の答えが、解説に出てくる数値と近いのに一致しない設問（JK.check.roundGap。36.8 と 36.7 など、丸めの境目のずれ）
              画面では、ずれのある出題は乱数を変えて作り直すので表には出にくいが、割合が高い演習は式の立て方を直す
   3. 解説に答えが出ない: 数値の答えが、解説のどのステップにも出てこない設問（JK.check.uncovered）。
              解説がその設問に触れていない（シミュレーターの計算の解説を流用しただけ、など）ので、その設問を求めるステップを足す
   4. 式が合わない: 解説の式「0.25 × 13.9 = 3.46」を、表示されている数値どうしで計算すると、表示の結果と最後の桁が合わない出題。
              丸めた途中の値を次の式に代入すると起きる（生徒が電卓で追うと合わない）。問題文の数値から直接計算する式にするか、
              途中の値を 1 桁多く表示して、表示どおりに計算して結果と一致するようにする */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const argv = process.argv.slice(2);
const STATIC = argv.includes('--static');
const rest = argv.filter((a) => !/^--/.test(a));
const want = rest[0] || 'all';
const N = Number(rest[1] || 200);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const list = [];
html.replace(/<script src="([^"]+)"/g, (m, s) => {
  if (STATIC ? (/^js\/(core|data)\//.test(s) && !/dict-|idioms/.test(s)) : /^js\/(core|data\/units|physics)/.test(s)) list.push(s);
  return m;
});
const sandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval };
sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.navigator = { userAgent: 'node' };
vm.createContext(sandbox);
const fileOf = {};
list.forEach((rel) => {
  const before = sandbox.JK && sandbox.JK.problems ? sandbox.JK.problems.length : 0;
  vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel });
  const P = sandbox.JK && sandbox.JK.problems;
  if (P) for (let i = before; i < P.length; i++) fileOf[P[i].id] = rel;
});
const JK = sandbox.JK;

/* ---------- 4. 解説の式を、表示されている数値で計算し直す ---------- */
// 単位（\mathrm{…}・\text{…}。{} の入れ子 1 段まで）と空白の命令を取り除く
function stripUnits(s) {
  return s.replace(/\\(?:mathrm|text|textbf|mathbf)\{(?:[^{}]|\{[^{}]*\})*\}/g, ' ')
    .replace(/\\(?:Omega|degree|%|circ)(?![A-Za-z])/g, ' ').replace(/\^\{\s*\}/g, ' ')
    .replace(/\\[,;!: ]/g, ' ').replace(/\\(?:left|right|displaystyle|bigl|bigr|Bigl|Bigr|big|Big)(?![A-Za-z])/g, ' ')
    .replace(/\\[dt]frac/g, '\\frac').replace(/\{,\}/g, '').replace(/~/g, ' ');
}
// 数値と四則・分数・根号・累乗だけでできた式を字句に分ける。文字や未知の命令があれば null（数値式ではない）
function tokenize(s) {
  const out = [];
  const re = /\s+|(\d+(?:\.\d+)?)|(\\times|×|\\cdot|·)|(\\div|÷)|(\\frac)|(\\sqrt)|(\\pi)|(\\\{|\\\}|\\lvert|\\rvert|[-+−\/^(){}\[\]|])|([\s\S])/g;
  let m;
  while ((m = re.exec(s))) {
    if (m[0].trim() === '') continue;
    if (m[1] !== undefined) out.push({ t: 'num', v: Number(m[1]) });
    else if (m[2]) out.push({ t: '*' });
    else if (m[3]) out.push({ t: '/' });
    else if (m[4]) out.push({ t: 'frac' });
    else if (m[5]) out.push({ t: 'sqrt' });
    else if (m[6]) out.push({ t: 'num', v: Math.PI });
    else if (m[7]) out.push({ t: m[7] === '−' ? '-' : m[7] === '\\{' ? '(' : m[7] === '\\}' ? ')' : (m[7] === '\\lvert' || m[7] === '\\rvert') ? '|' : m[7] });
    else return null;
  }
  return out;
}
function parse(tokens) {
  let i = 0;
  const peek = () => tokens[i];
  const eat = (t) => { if (tokens[i] && tokens[i].t === t) { i++; return true; } return false; };
  function group() {
    if (!eat('{')) throw new Error('group');
    const v = expr();
    if (!eat('}')) throw new Error('group end');
    return v;
  }
  function primary() {
    const k = peek();
    if (!k) throw new Error('end');
    if (k.t === 'num') { i++; return k.v; }
    if (k.t === '(') { i++; const v = expr(); if (!eat(')')) throw new Error(')'); return v; }
    if (k.t === '[') { i++; const v = expr(); if (!eat(']')) throw new Error(']'); return v; }
    if (k.t === '|') { i++; const v = expr(); if (!eat('|')) throw new Error('|'); return Math.abs(v); }   // 絶対値 |a − b|
    if (k.t === '{') return group();
    if (k.t === 'frac') { i++; const a = group(), b = group(); return a / b; }
    if (k.t === 'sqrt') {
      i++;
      if (peek() && peek().t === '[') { i++; const n = expr(); if (!eat(']')) throw new Error(']'); return Math.pow(group(), 1 / n); }
      return Math.sqrt(group());
    }
    throw new Error('primary');
  }
  function power() {
    let v = primary();
    while (peek() && peek().t === '^') {
      i++;
      let e;
      if (peek() && peek().t === '{') e = group();
      else if (peek() && peek().t === 'num') { e = peek().v; i++; }
      else if (peek() && peek().t === '-') { i++; e = -primary(); }
      else throw new Error('pow');
      v = Math.pow(v, e);
    }
    return v;
  }
  function unary() {
    if (eat('-')) return -unary();
    if (eat('+')) return unary();
    return power();
  }
  function term() {
    let v = unary();
    for (;;) {
      const k = peek();
      if (!k) break;
      if (k.t === '*') { i++; v *= unary(); }
      else if (k.t === '/') { i++; v /= unary(); }
      else if (k.t === 'num' || k.t === '(' || k.t === 'frac' || k.t === 'sqrt' || k.t === '{') v *= power();   // 省略された掛け算
      else break;
    }
    return v;
  }
  function expr() {
    let v = term();
    for (;;) {
      if (eat('+')) v += term();
      else if (eat('-')) v -= term();
      else break;
    }
    return v;
  }
  const v = expr();
  if (i !== tokens.length) throw new Error('rest');
  return v;
}
// 数値式として読めたら { v, plain, ulp }。plain = 「3.39」「2.20 × 10^{4}」のような 1 つの数、ulp = その最後の桁の 1
function evalTex(src) {
  const s = stripUnits(src).trim();
  if (!s) return null;
  const tk = tokenize(s);
  if (!tk || !tk.length) return null;
  let v;
  try { v = parse(tk); } catch (e) { return null; }
  if (!isFinite(v)) return null;
  const pm = /^(-?)\s*(\d+)(?:\.(\d+))?(?:\s*(?:\\times|×)\s*10\s*\^\s*\{?\s*(-?\d+)\s*\}?)?$/.exec(s);
  const res = { v, plain: !!pm };
  if (pm) res.ulp = Math.pow(10, -(pm[3] ? pm[3].length : 0)) * Math.pow(10, pm[4] ? Number(pm[4]) : 0);
  return res;
}
// 1 行の式から、「計算式 = 数」で、表示の数値どうしの計算と表示の結果が合わない箇所を返す
function checkLine(line) {
  const out = [];
  const chunks = String(line).replace(/\\[,;!:]/g, ' ').replace(/\\text\{[^{}]*\}/g, ' \\quad ')
    .split(/\\qquad|\\quad|\\Rightarrow|\\Leftrightarrow|\\therefore|\\to(?![A-Za-z])|、|,(?![^{}]*\})/);
  chunks.forEach((chunk) => {
    let prev = null;
    chunk.split(/=|\\approx|\\fallingdotseq|\\simeq|\\doteq|≒/).forEach((seg) => {
      const cur = evalTex(seg);
      // 左が計算式・右が 1 つの数のときだけ比べる（数 = 数 は単位の換算、π = 180° は角度の換算なので見ない）
      if (cur && prev && cur.plain && !prev.plain && cur.v !== 0 && prev.v !== 0 && !(/\\degree|\\circ|°/.test(seg) && /\\pi/.test(prev.src))) {
        // 単位の接頭語（nC, mm, kJ）や % で 10 の何乗かが変わるので、いちばん近い 10^k 倍で比べる
        const k = Math.round(Math.log10(Math.abs(prev.v / cur.v)));
        const shown = cur.v * Math.pow(10, k), ulp = cur.ulp * Math.pow(10, k);
        if (Math.abs(prev.v - shown) > 0.6 * ulp + 1e-9 * Math.abs(shown)) out.push({ lhs: prev.src, calc: prev.v / Math.pow(10, k), shown: seg.trim() });
      }
      if (cur) { cur.src = seg.trim(); prev = cur; } else prev = null;
    });
  });
  return out;
}
// 問題・演習 1 つの解説（全ステップ + explain）から、合わない式を集める
function chainHits(ex) {
  const hits = [];
  const add = (where, tex) => checkLine(tex).forEach((h) => hits.push(Object.assign({ where }, h)));
  const inline = (where, t) => String(t || '').replace(/\$([^$]*)\$/g, (all, tex) => { add(where, tex); return ''; });
  (ex.solution || []).forEach((st, si) => {
    const where = 'step ' + (si + 1);
    [].concat(st.m || []).forEach((m) => add(where, m));
    inline(where, st.n); inline(where, st.easy); inline(where, st.pro);
  });
  (ex.parts || []).forEach((p, pi) => inline('explain (' + (pi + 1) + ')', p.explain));
  return hits;
}
const hitText = (h) => h.where + ': ' + h.lhs.replace(/\s+/g, ' ').slice(0, 100) + ' → 計算すると ' + Number(h.calc.toPrecision(5)) + ' / 表示は ' + h.shown.replace(/\s+/g, ' ').slice(0, 40);

if (STATIC) {
  let n = 0, total = 0;
  JK.problems.forEach((p) => {
    if (p.subject === 'english') return;
    total++;
    const hits = chainHits(p);
    if (!hits.length) return;
    n++;
    console.log(fileOf[p.id] + '  ' + p.id);
    hits.forEach((h) => console.log('   ' + hitText(h)));
  });
  console.log('\n固定の問題（数学・物理）' + total + ' 題のうち、式が合わない箇所のあるもの ' + n + ' 題');
  process.exit(0);
}

const LEVELS = ['basic', 'mid', 'adv'];
const rows = [];
JK.sims.forEach((s) => {
  if (want !== 'all' && s.id !== want) return;
  LEVELS.forEach((lv) => {
    const seen = {};
    let n = 0, parts = 0, gaps = 0, errors = 0, miss = 0, chain = 0;
    const samples = [], missAt = {}, chainSamples = [], chainAt = {};
    for (let seed = 1; seed <= N; seed++) {
      let ex;
      try { ex = s.exercise(JK.util.rng(seed * 104729 + lv.length), lv); } catch (e) { errors++; continue; }
      n++;
      const key = ex.title + ' | ' + (ex.parts || []).map((p) => (typeof p.answer === 'number' ? +p.answer.toPrecision(4) : JSON.stringify(p.answer))).join(', ');
      seen[key] = (seen[key] || 0) + 1;
      const g = JK.check.roundGap(ex);
      parts += (ex.parts || []).filter((p) => p.type === 'num').length;
      gaps += g.length;
      if (g.length && samples.length < 2) samples.push('(' + (g[0] + 1) + ') 答え ' + ex.parts[g[0]].answer);
      // ずれ（近いのに一致しない）は上で数えるので、ここでは「近い値すら出てこない」設問だけを数える
      JK.check.uncovered(ex).filter((i) => g.indexOf(i) < 0).forEach((i) => { miss++; missAt[i + 1] = (missAt[i + 1] || 0) + 1; });
      const ch = chainHits(ex);
      if (ch.length) {
        chain++;
        ch.forEach((h) => { chainAt[h.where] = (chainAt[h.where] || 0) + 1; });
        if (chainSamples.length < 4) chainSamples.push('種 ' + seed + ' ' + hitText(ch[0]));
      }
    }
    const keys = Object.keys(seen).sort((a, b) => seen[b] - seen[a]);
    rows.push({ id: s.id, lv, n, distinct: keys.length, top: keys.slice(0, 3).map((k) => seen[k] + '× ' + k), parts, gaps, samples, errors, miss, missAt, chain, chainSamples, chainAt });
  });
});

if (want !== 'all') {
  rows.forEach((r) => {
    console.log(r.id + ' ' + r.lv + ': ' + r.distinct + ' 通り / ' + r.n + ' 種、ずれ ' + r.gaps + ' / ' + r.parts + ' 設問' +
      (r.miss ? '、解説に答えが出ない ' + r.miss + '（設問番号 ' + JSON.stringify(r.missAt) + '）' : '') +
      '、式が合わない出題 ' + r.chain + (r.chain ? '（' + JSON.stringify(r.chainAt) + '）' : '') + (r.errors ? '、例外 ' + r.errors : ''));
    r.top.forEach((t) => console.log('   ' + t));
    r.samples.forEach((t) => console.log('   ずれの例 ' + t));
    r.chainSamples.forEach((t) => console.log('   式が合わない例 ' + t));
  });
} else {
  const few = rows.filter((r) => r.distinct < 12).sort((a, b) => a.distinct - b.distinct);
  const gap = rows.filter((r) => r.parts && r.gaps / r.parts >= 0.02).sort((a, b) => b.gaps / b.parts - a.gaps / a.parts);
  console.log('演習 ' + rows.length + ' 種（シミュレーター ' + JK.sims.length + ' × レベル 3）、種 ' + N + ' 個ずつ');
  console.log('\n== 通り数が 12 未満（' + few.length + ' 種）');
  few.forEach((r) => console.log('  ' + r.distinct + ' 通り\t' + r.id + ' ' + r.lv));
  console.log('\n== 答えと解説の数値のずれが 2% 以上（' + gap.length + ' 種）');
  gap.forEach((r) => console.log('  ' + (100 * r.gaps / r.parts).toFixed(1) + '%\t' + r.id + ' ' + r.lv + '\t' + r.samples.join(' ｜ ')));
  const cov = rows.filter((r) => r.parts && r.miss / r.parts >= 0.02).sort((a, b) => b.miss / b.parts - a.miss / a.parts);
  console.log('\n== 解説に答えの数値が出てこない設問が 2% 以上（' + cov.length + ' 種）');
  cov.forEach((r) => console.log('  ' + (100 * r.miss / r.parts).toFixed(1) + '%\t' + r.id + ' ' + r.lv + '\t設問番号 ' + JSON.stringify(r.missAt)));
  const chn = rows.filter((r) => r.n && r.chain / r.n >= 0.02).sort((a, b) => b.chain / b.n - a.chain / a.n);
  console.log('\n== 解説の式が、表示の数値で計算し直すと合わない出題が 2% 以上（' + chn.length + ' 種）');
  chn.forEach((r) => console.log('  ' + (100 * r.chain / r.n).toFixed(0) + '%\t' + r.id + ' ' + r.lv + '\t' + (r.chainSamples[0] || '')));
  const tg = rows.reduce((s, r) => s + r.gaps, 0), tp = rows.reduce((s, r) => s + r.parts, 0), te = rows.reduce((s, r) => s + r.errors, 0);
  const tm = rows.reduce((s, r) => s + r.miss, 0), tc = rows.reduce((s, r) => s + r.chain, 0), tn = rows.reduce((s, r) => s + r.n, 0);
  console.log('\n全体: 数値の設問 ' + tp + ' のうち、ずれ ' + tg + '（' + (100 * tg / tp).toFixed(2) + '%）、解説に出ない ' + tm + '（' + (100 * tm / tp).toFixed(2) + '%）' +
    ' ／ 出題 ' + tn + ' のうち、式が合わないもの ' + tc + '（' + (100 * tc / tn).toFixed(1) + '%）' + (te ? ' / 例外 ' + te : ''));
}
