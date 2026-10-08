#!/usr/bin/env node
/* GOKAKU NAVI — 検証ツール
   node tools/validate.js <file...>     指定ファイルを共通基盤に読み込んで検証
   node tools/validate.js --all         index.html の読み込み順で全ファイルを検証 + 網羅性チェック
   オプション: --quiet（警告を出さない） --inventory（登録内容の集計を表示） */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CORE = ['js/core/ns.js', 'js/core/util.js', 'js/core/tex.js', 'js/core/plot.js', 'js/core/steps.js', 'js/data/units.js'];

const args = process.argv.slice(2);
const flags = new Set(args.filter((a) => a.startsWith('--')));
let files = args.filter((a) => !a.startsWith('--'));
const ALL = flags.has('--all');
const QUIET = flags.has('--quiet');

const errors = [];
const warnings = [];
let where = '';
function err(msg) { errors.push((where ? '[' + where + '] ' : '') + msg); }
function warn(msg) { warnings.push((where ? '[' + where + '] ' : '') + msg); }

/* ---------- サンドボックス ---------- */
const sandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.navigator = { userAgent: 'node' };
vm.createContext(sandbox);

function load(rel) {
  const abs = path.isAbsolute(rel) ? rel : path.join(ROOT, rel);
  if (!fs.existsSync(abs)) { err('ファイルがありません: ' + rel); return false; }
  const code = fs.readFileSync(abs, 'utf8');
  if (code.charCodeAt(0) === 0xFEFF) warn(rel + ': BOM 付き UTF-8 です（BOM なしにしてください）');
  try {
    vm.runInContext(code, sandbox, { filename: abs });
    return true;
  } catch (e) {
    err(rel + ' の読み込みで例外: ' + (e && e.stack ? e.stack.split('\n').slice(0, 4).join(' | ') : e));
    return false;
  }
}

for (const c of CORE) {
  if (!load(c)) {
    console.error('共通基盤の読み込みに失敗: ' + c);
    console.error(errors.join('\n'));
    process.exit(2);
  }
}
const JK = sandbox.JK;

if (ALL) {
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  const re = /<script\s+src="([^"]+)"/g;
  let m;
  files = [];
  while ((m = re.exec(html))) {
    if (CORE.includes(m[1]) || m[1].startsWith('js/app/')) continue;
    files.push(m[1]);
  }
}
if (!files.length) {
  console.log('使い方: node tools/validate.js <file...> | --all');
  process.exit(0);
}

/* ---------- 文字列検査 ---------- */
const CTRL = /[\u0000-\u0008\u000B-\u001F\u007F]/;
function ctrlCheck(s, label) {
  if (typeof s !== 'string') return;
  const m = CTRL.exec(s);
  if (m) err(label + ': 制御文字 (U+' + m[0].charCodeAt(0).toString(16).padStart(4, '0') + ') を含む。String.raw を使わずに \\t \\f \\r 等が化けた可能性');
  if (/\t/.test(s)) err(label + ': タブ文字を含む（\\theta や \\times が化けた可能性）');
  if (/\bundefined\b|\[object Object\]|\bNaN\b/.test(s)) err(label + ': "undefined" / "NaN" / "[object Object]" を含む（テンプレート展開の失敗の可能性）');
}
// String.raw を使わずに書いて \ が落ちた数式を見つける（'$\Delta U$' は $Delta U$ になり、エラーにならずに「DeltaU」と表示される）
const BARE_TEX = /(^|[^\\A-Za-z])(Delta|Omega|Sigma|Lambda|alpha|gamma|delta|lambda|omega|sigma|epsilon|kappa|phi|psi|pi|dfrac|sqrt|cdot|cdots|dots|ldots|mathrm|mathbf|overline|leq|geq|approx|fallingdotseq|infty|quad|qquad|Rightarrow|Leftrightarrow|displaystyle|sin|cos|log|lim|sum|int|circ|angle|perp|ell|prime|equiv|propto|partial|left(?=[([|\\.])|hat(?=\{))(?![A-Za-z])/;
function bareTexCheck(tex, label) {
  const t = tex.replace(/\\(text|mathrm|mathbf|textbf|operatorname)\{[^{}]*\}/g, ' ');
  const m = BARE_TEX.exec(t);
  if (m) err(label + ': 数式の中に \\ のない命令名「' + m[2] + '」がある（String.raw を使わずに書いて \\ が落ちた可能性）');
  if (/\n/.test(tex)) err(label + ': 数式の中に改行がある（\\nu や \\neq を String.raw なしで書いた可能性）');
}
function richCheck(s, label, opts) {
  if (s == null) return;
  if (typeof s !== 'string') { err(label + ': 文字列ではない (' + typeof s + ')'); return; }
  ctrlCheck(s, label);
  const es = JK.richCheck(s);
  es.forEach((e) => err(label + ': 数式エラー — ' + e + ' ／ 「' + s.slice(0, 60).replace(/\n/g, ' ') + '…」'));
  if (opts && opts.english && /(^|[^\\])\$/.test(s)) warn(label + ': 英語テキストに $ がある（数式扱いになる。通貨記号は \\$ と書く）');
  else if (!es.length) s.replace(/\\\$/g, '').replace(/\$([^$]*)\$/g, (all, tex) => { bareTexCheck(tex, label); return ''; });
}
function texCheck(s, label) {
  if (s == null) return;
  if (typeof s !== 'string') { err(label + ': 文字列ではない (' + typeof s + ')'); return; }
  ctrlCheck(s, label);
  if (/(^|[^\\])\$/.test(s)) err(label + ': 数式欄に $ は不要（TeX を直接書く）');
  JK.tex.check(s).forEach((e) => err(label + ': 数式エラー — ' + e + ' ／ 「' + s.slice(0, 60) + '…」'));
  bareTexCheck(s, label);
}
function svgCheck(s, label) {
  if (s == null) return;
  if (typeof s !== 'string') { err(label + ': SVG が文字列ではない'); return; }
  const t = s.trim();
  if (!/^<svg[\s>]/.test(t) || !/<\/svg>$/.test(t)) { err(label + ': <svg>…</svg> の形式ではない'); return; }
  if (/NaN|undefined|Infinity/.test(t)) err(label + ': SVG に NaN / undefined / Infinity を含む');
  if (/(stroke|fill)="(#|rgb|hsl)/i.test(t) || /style="[^"]*(#[0-9a-f]{3,8}|rgb\()/i.test(t)) warn(label + ': SVG に色コード直書きがある（クラス指定に統一）');
  const stack = [];
  const re = /<(\/?)([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^<>"'])*?)(\/?)>/g;
  let m;
  while ((m = re.exec(t))) {
    if (m[1]) {
      const top = stack.pop();
      if (top !== m[2]) { err(label + ': SVG のタグ対応が不正 (</' + m[2] + '> に対して <' + top + '>)'); return; }
    } else if (!m[4]) stack.push(m[2]);
  }
  if (stack.length) err(label + ': SVG の閉じタグ不足 (' + stack.join(',') + ')');
}

/* ---------- ステップ ---------- */
function stepsCheck(steps, label, minCount) {
  if (!Array.isArray(steps)) { err(label + ': steps/solution が配列ではない'); return { n: 0, easy: 0 }; }
  if (steps.length < minCount) warn(label + ': ステップ数が少ない (' + steps.length + ' < ' + minCount + ')');
  let easy = 0;
  steps.forEach((s, i) => {
    const L = label + ' step' + (i + 1);
    if (!s || typeof s !== 'object') { err(L + ': オブジェクトではない'); return; }
    if (s.m == null && !s.n) err(L + ': m か n のどちらかが必要');
    if (s.m != null) (Array.isArray(s.m) ? s.m : [s.m]).forEach((line, j) => texCheck(line, L + ' m[' + j + ']'));
    richCheck(s.t, L + ' t');
    richCheck(s.n, L + ' n');
    richCheck(s.easy, L + ' easy');
    richCheck(s.pro, L + ' pro');
    if (s.easy) easy++;
    if (s.lv != null && [1, 2, 3].indexOf(s.lv) < 0) err(L + ': lv は 1〜3');
    if (s.fig != null) svgCheck(s.fig, L + ' fig');
    Object.keys(s).forEach((k) => { if (['t', 'm', 'n', 'easy', 'pro', 'fig', 'lv'].indexOf(k) < 0) warn(L + ': 未知のフィールド ' + k); });
  });
  return { n: steps.length, easy };
}

/* ---------- 問題 ---------- */
const SUBJECTS = ['math', 'physics', 'english'];
const LEVELS = ['basic', 'mid', 'adv', 'drill'];
const PART_TYPES = ['num', 'expr', 'choice', 'multi', 'text', 'order'];
const PROBLEM_KEYS = ['id', 'subject', 'level', 'unit', 'title', 'source', 'time', 'body', 'fig', 'passage', 'parts', 'solution', 'prereq', 'tags'];

function partCheck(part, L, p, opts) {
  const eng = p.subject === 'english';
  if (!part || typeof part !== 'object') { err(L + ': オブジェクトではない'); return; }
  if (PART_TYPES.indexOf(part.type) < 0) { err(L + ': type が不正 (' + part.type + ')'); return; }
  richCheck(part.q, L + ' q', { english: eng });
  richCheck(part.explain, L + ' explain', { english: eng });
  richCheck(part.hint, L + ' hint');
  if (part.hint && ['num', 'expr', 'text'].indexOf(part.type) < 0) warn(L + ': hint は num / expr / text の入力欄にだけ表示される');
  // 乱数で作る演習は入力例が固定なので、偶然の一致は画面側（JK.check.hintFor）で隠す
  if (!(opts && opts.generated)) JK.check.hintLeak(part).forEach((c) => err(L + ': hint の入力例がそのまま正解になる（' + c + '）。正解と違う値の例にする'));
  if (part.label != null && typeof part.label !== 'string') err(L + ': label は文字列');
  switch (part.type) {
    case 'num':
      if (typeof part.answer !== 'number' || !isFinite(part.answer)) { err(L + ': num の answer は有限の数値 (' + part.answer + ')'); break; }
      if (part.rel != null && !(part.rel >= 0 && part.rel < 0.5)) err(L + ': rel が不正');
      if (part.tol != null && !(part.tol >= 0)) err(L + ': tol が不正');
      if (part.show != null) texCheck(part.show, L + ' show');
      if (!JK.check.part(part, String(part.answer)).ok) err(L + ': 正解値を入力しても正解にならない');
      break;
    case 'expr': {
      if (typeof part.answer !== 'string') { err(L + ': expr の answer は文字列'); break; }
      const vars = part.vars || ['x'];
      if (!Array.isArray(vars) || vars.some((v) => typeof v !== 'string' || v.length !== 1)) err(L + ': vars は 1 文字の変数名の配列');
      try { JK.expr.parse(part.answer, vars); } catch (e) { err(L + ': answer の式を解釈できない — ' + e.message + ' (' + part.answer + ')'); break; }
      if (!JK.expr.equal(part.answer, part.answer, vars)) err(L + ': answer の式が数値評価できない (' + part.answer + ')');
      if (part.show != null) texCheck(part.show, L + ' show');
      break;
    }
    case 'choice':
    case 'multi': {
      if (!Array.isArray(part.choices) || part.choices.length < 2) { err(L + ': choices が 2 個以上必要'); break; }
      part.choices.forEach((c, i) => {
        if (typeof c === 'string') richCheck(c, L + ' choices[' + i + ']', { english: eng });
        else if (c && typeof c === 'object') {
          if (c.t == null && c.fig == null) err(L + ' choices[' + i + ']: t か fig が必要');
          richCheck(c.t, L + ' choices[' + i + '].t', { english: eng });
          if (c.fig != null) svgCheck(c.fig, L + ' choices[' + i + '].fig');
        } else err(L + ' choices[' + i + ']: 文字列か {t, fig}');
      });
      if (part.type === 'choice') {
        if (!Number.isInteger(part.answer) || part.answer < 0 || part.answer >= part.choices.length) err(L + ': answer の添字が範囲外 (' + part.answer + ')');
      } else {
        if (!Array.isArray(part.answer) || !part.answer.length) err(L + ': multi の answer は添字配列');
        else {
          if (new Set(part.answer).size !== part.answer.length) err(L + ': multi の answer に重複');
          part.answer.forEach((a) => { if (!Number.isInteger(a) || a < 0 || a >= part.choices.length) err(L + ': answer の添字が範囲外 (' + a + ')'); });
        }
      }
      if (eng && !part.explain) err(L + ': 英語の選択問題には explain が必須');
      break;
    }
    case 'text': {
      const as = Array.isArray(part.answer) ? part.answer : [part.answer];
      if (!as.length || as.some((a) => typeof a !== 'string' || !a.trim())) err(L + ': text の answer は空でない文字列（または配列）');
      break;
    }
    case 'order': {
      if (!Array.isArray(part.words) || part.words.length < 2 || part.words.some((w) => typeof w !== 'string' || !w.trim())) { err(L + ': order の words が不正'); break; }
      if (typeof part.answer !== 'string') { err(L + ': order の answer は文字列'); break; }
      const a = JK.check.normOrder(part.words.slice().sort().join(' ')).split(' ').sort().join(' ');
      const b = JK.check.normOrder(part.answer).split(' ').sort().join(' ');
      if (a !== b) err(L + ': order の words と answer の語が一致しない');
      if (JK.check.normOrder(part.words.join(' ')) === JK.check.normOrder(part.answer)) warn(L + ': order の words が正解順のまま（シャッフルする）');
      break;
    }
  }
}

function problemCheck(p, opts) {
  const L = '問題 ' + p.id;
  opts = opts || {};
  if (typeof p.id !== 'string' || !/^[a-z0-9-]+$/.test(p.id)) err(L + ': id は英小文字・数字・ハイフン');
  if (!opts.generated) {
    if (SUBJECTS.indexOf(p.subject) < 0) err(L + ': subject が不正 (' + p.subject + ')');
    if (LEVELS.indexOf(p.level) < 0) err(L + ': level が不正 (' + p.level + ')');
    const u = JK.units[p.unit];
    if (!u) err(L + ': unit が未定義 (' + p.unit + ')');
    else if (u.subject !== p.subject) err(L + ': unit ' + p.unit + ' は ' + u.subject + ' の単元（subject=' + p.subject + '）');
    if (!p.source || typeof p.source !== 'object' || typeof p.source.univ !== 'string') err(L + ': source.univ が必要');
    if (typeof p.time !== 'number') warn(L + ': time（目安分）がない');
    Object.keys(p).forEach((k) => { if (PROBLEM_KEYS.indexOf(k) < 0) warn(L + ': 未知のフィールド ' + k); });
  }
  if (typeof p.title !== 'string' || !p.title.trim()) err(L + ': title が必要');
  const eng = p.subject === 'english';
  if (typeof p.body !== 'string' || !p.body.trim()) err(L + ': body が必要');
  richCheck(p.body, L + ' body', { english: eng });
  if (p.fig != null) svgCheck(p.fig, L + ' fig');
  if (p.prereq != null) {
    if (!Array.isArray(p.prereq)) err(L + ': prereq は配列');
    else p.prereq.forEach((u2) => { if (!JK.units[u2]) err(L + ': prereq の単元が未定義 (' + u2 + ')'); });
  }
  if (!Array.isArray(p.parts) || !p.parts.length) err(L + ': parts が必要');
  else p.parts.forEach((part, i) => partCheck(part, L + ' part' + (i + 1), p, opts));
  stepsCheck(p.solution, L + ' solution', p.level === 'drill' ? 2 : 3);
}

/* ---------- 長文 ---------- */
function passageCheck(p) {
  const L = '長文 ' + p.id;
  if (typeof p.title !== 'string' || !p.title) err(L + ': title が必要');
  if (LEVELS.indexOf(p.level) < 0) err(L + ': level が不正');
  if (!Array.isArray(p.paras) || !p.paras.length) { err(L + ': paras が必要'); return; }
  const nums = {};
  p.paras.forEach((para, i) => {
    if (!Array.isArray(para) || !para.length) { err(L + ': 段落 ' + (i + 1) + ' が空'); return; }
    para.forEach((st, j) => {
      const S = L + ' 段落' + (i + 1) + ' 文' + (j + 1);
      if (!st || typeof st.en !== 'string' || !st.en.trim()) { err(S + ': en が必要'); return; }
      if (typeof st.ja !== 'string' || !st.ja.trim()) err(S + ': ja が必要');
      ctrlCheck(st.en, S + ' en');
      ctrlCheck(st.ja, S + ' ja');
      const stripped = st.en.replace(/\{[bu]\d+:[^{}]*\}/g, '');
      if (/[{}]/.test(stripped)) err(S + ': {bN:..} / {uN:..} の書式が不正 — ' + st.en.slice(0, 50));
      JK.passage.marks(st.en).forEach((mk) => {
        const key = mk.type + mk.n;
        if (mk.type === 'b' && nums[key]) warn(S + ': 空所番号 ' + mk.n + ' が複数回（同じ語が入る空所でなければ番号を分ける）');
        nums[key] = true;
        if (!mk.text.trim()) err(S + ': 空の {' + mk.type + mk.n + ':}');
      });
    });
  });
  if (p.vocab != null && (!Array.isArray(p.vocab) || p.vocab.some((w) => typeof w !== 'string'))) err(L + ': vocab は文字列配列');
  if (p.vocabExtra != null) p.vocabExtra.forEach((e) => dictEntryCheck(e, L + ' vocabExtra'));
  if (Array.isArray(p.vocab)) {
    const missing = p.vocab.filter((w) => !JK.dict.words[String(w).toLowerCase()]);
    if (missing.length && ALL) warn(L + ': vocab のうち辞書にない語（vocabExtra に追加を推奨）: ' + missing.join(', '));
  }
}

/* ---------- 辞書 ---------- */
const POS = ['名', '動', '形', '副', '前', '接', '代', '助', '冠', '間', '数'];
function dictEntryCheck(e, L) {
  if (!Array.isArray(e) || e.length !== 4) { err(L + ': 辞書エントリは [語, 品詞, 語義, レベル] — ' + JSON.stringify(e)); return; }
  if (typeof e[0] !== 'string' || !/^[a-z][a-z' .-]*$/.test(e[0])) err(L + ': 見出し語が不正（小文字の原形）— ' + e[0]);
  if (POS.indexOf(e[1]) < 0) err(L + ': 品詞が不正 — ' + e[0] + ' / ' + e[1]);
  if (typeof e[2] !== 'string' || !e[2].trim()) err(L + ': 語義が空 — ' + e[0]);
  if ([0, 1, 2, 3].indexOf(e[3]) < 0) err(L + ': レベルは 0〜3 — ' + e[0]);
}

/* ---------- 計算機 / シミュレーター ---------- */
const INPUT_TYPES = ['q', 'num', 'int', 'select', 'list', 'text', 'poly'];
const COURSES = ['IA', 'IIB', 'IIIC'];
const FIELDS = ['力学', '熱力学', '波動', '電磁気', '原子'];

function inputsCheck(def, L) {
  if (!Array.isArray(def.inputs)) { err(L + ': inputs が配列ではない'); return false; }
  const keys = {};
  def.inputs.forEach((inp) => {
    if (!inp.key || keys[inp.key]) err(L + ': input の key が不正/重複 (' + inp.key + ')');
    keys[inp.key] = true;
    if (INPUT_TYPES.indexOf(inp.type) < 0) err(L + ': input ' + inp.key + ' の type が不正 (' + inp.type + ')');
    if (typeof inp.label !== 'string') err(L + ': input ' + inp.key + ' の label が必要');
    else richCheck(inp.label, L + ' input ' + inp.key + ' label');
    if (inp.def == null) err(L + ': input ' + inp.key + ' の def（既定値）が必要');
    if (inp.type === 'select' && (!Array.isArray(inp.options) || !inp.options.length)) err(L + ': select ' + inp.key + ' に options が必要');
    richCheck(inp.hint, L + ' input ' + inp.key + ' hint');
  });
  return true;
}

function resultCheck(res, L, needFig) {
  if (!res || typeof res !== 'object') { err(L + ': compute の戻り値がオブジェクトではない'); return null; }
  if (!Array.isArray(res.result) || !res.result.length) err(L + ': result が空');
  else res.result.forEach((r, i) => {
    if (!r || typeof r.label !== 'string') err(L + ': result[' + i + '].label が必要');
    texCheck(r && r.tex, L + ' result[' + i + '].tex');
    if (r && r.tex == null) err(L + ': result[' + i + '].tex が必要');
  });
  const st = stepsCheck(res.steps, L, 2);
  if (res.fig != null) svgCheck(res.fig, L + ' fig');
  else if (needFig) err(L + ': fig が必要');
  return st;
}

function randomRaw(def, rng) {
  const raw = JK.inputs.defaults(def.inputs);
  def.inputs.forEach((inp) => {
    const lo = inp.min != null ? inp.min : -6, hi = inp.max != null ? inp.max : 9;
    switch (inp.type) {
      case 'q': {
        const kind = rng.int(0, 3);
        let v;
        if (kind === 0) v = String(rng.int(Math.ceil(lo), Math.floor(hi)));
        else if (kind === 1) v = rng.int(1, 9) + '/' + rng.int(2, 5);
        else if (kind === 2) v = String(rng.int(-9, 9) / 2);
        else v = '0';
        const q = JK.Q.from(v);
        raw[inp.key] = (q && q.val() >= lo && q.val() <= hi) ? v : raw[inp.key];
        break;
      }
      case 'num': {
        const v = rng.bool(0.5) ? rng.int(Math.ceil(lo), Math.floor(hi)) : Math.round(rng.float(lo, hi) * 100) / 100;
        raw[inp.key] = String(v);
        break;
      }
      case 'int':
        raw[inp.key] = String(rng.int(Math.ceil(lo), Math.floor(Math.min(hi, lo + 14))));
        break;
      case 'select':
        raw[inp.key] = String(rng.pick(inp.options)[0]);
        break;
      case 'list': {
        const n = rng.int(2, 8), arr = [];
        for (let i = 0; i < n; i++) arr.push(rng.int(-5, 20));
        if (rng.bool(0.6)) raw[inp.key] = arr.join(', ');
        break;
      }
      default: break;
    }
  });
  return raw;
}

function runCompute(def, raw, ctx, L, needFig, strict) {
  let parsed;
  try { parsed = JK.inputs.parse(def.inputs, raw); }
  catch (e) { err(L + ': 入力解釈で例外 ' + e); return null; }
  if (parsed.error) { if (strict) err(L + ': 既定値/例の入力がエラーになる — ' + parsed.error); return null; }
  let res;
  try { res = def.compute(parsed.values, ctx); }
  catch (e) {
    if (e instanceof JK.CalcError) { if (strict) err(L + ': 既定値/例で CalcError — ' + e.message); return null; }
    err(L + ': compute が例外 — ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e) + ' ／ 入力 ' + JSON.stringify(raw));
    return null;
  }
  const before = errors.length;
  const st = resultCheck(res, L, needFig);
  if (errors.length > before) errors.push('    ↑ 入力: ' + JSON.stringify(raw) + ' / depth=' + ctx.depth);
  return st;
}

function calcLikeCheck(def, kind) {
  const L = (kind === 'sim' ? 'sim ' : 'calc ') + def.id;
  if (!JK.units[def.unit]) err(L + ': unit が未定義 (' + def.unit + ')');
  if (kind === 'calc') {
    if (COURSES.indexOf(def.course) < 0) err(L + ': course が不正 (' + def.course + ')');
    if (typeof def.group !== 'string' || !def.group) err(L + ': group が必要');
  } else {
    if (FIELDS.indexOf(def.field) < 0) err(L + ': field が不正 (' + def.field + ')');
  }
  if (typeof def.title !== 'string' || !def.title) err(L + ': title が必要');
  if (typeof def.desc !== 'string' || !def.desc) warn(L + ': desc がない');
  richCheck(def.desc, L + ' desc');
  if (def.form == null) warn(L + ': form（公式）がない');
  else (Array.isArray(def.form) ? def.form : [def.form]).forEach((f, i) => texCheck(f, L + ' form[' + i + ']'));
  if (!def.intro || !def.intro.easy) err(L + ': intro.easy が必須');
  if (def.intro) ['easy', 'normal', 'pro'].forEach((k) => richCheck(def.intro[k], L + ' intro.' + k));
  if (typeof def.compute !== 'function') { err(L + ': compute が関数ではない'); return; }
  if (!inputsCheck(def, L)) return;

  const needFig = kind === 'sim';
  const raw0 = JK.inputs.defaults(def.inputs);
  let easyCount = 0, stepCount = 0;
  ['easy', 'normal', 'pro'].forEach((depth, i) => {
    const st = runCompute(def, raw0, { grade: i + 1, depth }, L + ' (既定値, ' + depth + ')', needFig, true);
    if (st && depth === 'easy') { easyCount = st.easy; stepCount = st.n; }
  });
  if (stepCount && stepCount < 3) warn(L + ': ステップが 3 未満');
  if (stepCount && easyCount < 2) err(L + ': easy を持つステップが 2 個未満 (' + easyCount + ')');
  (def.examples || []).forEach((ex, i) => {
    if (!ex || typeof ex.label !== 'string' || !ex.v) { err(L + ': examples[' + i + '] は {label, v}'); return; }
    const raw = Object.assign({}, raw0);
    Object.keys(ex.v).forEach((k) => { raw[k] = String(ex.v[k]); });
    runCompute(def, raw, { grade: 2, depth: 'easy' }, L + ' (example ' + ex.label + ')', needFig, true);
  });
  // 乱数入力で落ちないこと（CalcError は可）
  const rng = JK.util.rng(12345);
  for (let t = 0; t < 40; t++) {
    const before = errors.length;
    runCompute(def, randomRaw(def, rng), { grade: 2, depth: 'easy' }, L + ' (乱数入力)', false, false);
    if (errors.length > before) break;
  }

  if (kind === 'sim') {
    if (typeof def.exercise !== 'function') { err(L + ': exercise が関数ではない'); return; }
    ['basic', 'mid', 'adv'].forEach((level) => {
      for (let seed = 1; seed <= 12; seed++) {
        let ex;
        const LL = L + ' exercise(seed=' + seed + ',' + level + ')';
        try { ex = def.exercise(JK.util.rng(seed * 7919 + level.length), level); }
        catch (e) { err(LL + ': 例外 — ' + (e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : e)); return; }
        if (!ex || typeof ex !== 'object') { err(LL + ': 戻り値が不正'); return; }
        const before = errors.length;
        problemCheck(Object.assign({ id: 'gen-' + def.id, subject: 'physics' }, ex), { generated: true });
        if (errors.length > before) return;
      }
    });
  }
}

/* ---------- 実行 ---------- */
const stats = [];
for (const f of files) {
  where = f;
  const n0 = { p: JK.problems.length, ps: JK.passageList.length, c: JK.calcs.length, s: JK.sims.length, d: JK.dict.count, i: JK.dict.idioms.length, g: JK.grammar.length, re: JK._regErrors.length };
  const dictBefore = JK.dict.count;
  if (!load(f)) continue;
  JK._regErrors.slice(n0.re).forEach((e) => err(e));
  const np = JK.problems.slice(n0.p), nps = JK.passageList.slice(n0.ps), nc = JK.calcs.slice(n0.c), ns = JK.sims.slice(n0.s);
  nps.forEach(passageCheck);
  np.forEach((p) => problemCheck(p));
  nc.forEach((c) => calcLikeCheck(c, 'calc'));
  ns.forEach((s) => calcLikeCheck(s, 'sim'));
  stats.push({ f, problems: np.length, passages: nps.length, calcs: nc.length, sims: ns.length, dict: JK.dict.count - dictBefore, idioms: JK.dict.idioms.length - n0.i, grammar: JK.grammar.length - n0.g });
}
where = '';

// 辞書・熟語の形式（登録後の全体を検査）
Object.keys(JK.dict.words).forEach((w) => {
  JK.dict.words[w].forEach((e) => dictEntryCheck([e.w, e.pos, e.ja, e.lv], '辞書'));
});
JK.dict.idioms.forEach((e) => {
  if (typeof e.phrase !== 'string' || !e.phrase.trim()) err('熟語: phrase が不正');
  if (typeof e.ja !== 'string' || !e.ja.trim()) err('熟語: 意味が空 — ' + e.phrase);
  if ([0, 1, 2, 3].indexOf(e.lv) < 0) err('熟語: レベルは 0〜3 — ' + e.phrase);
});

// 長文参照
JK.problems.forEach((p) => {
  if (p.passage != null && !JK.passages[p.passage]) err('問題 ' + p.id + ': passage が未登録 (' + p.passage + ')');
});

/* ---------- 網羅性（--all のみ） ---------- */
if (ALL) {
  const cnt = {};
  JK.problems.forEach((p) => { const k = p.subject + '/' + p.level; cnt[k] = (cnt[k] || 0) + 1; });
  SUBJECTS.forEach((s) => ['basic', 'mid', 'adv'].forEach((lv) => { if (!cnt[s + '/' + lv]) err('網羅性: ' + s + ' の ' + lv + ' レベルの問題が 0'); }));
  JK.unitList.forEach((u) => {
    const drills = JK.problems.filter((p) => p.level === 'drill' && p.unit === u.id).length;
    if (drills < 3 && u.id !== 'e-vocab') warn('網羅性: 単元 ' + u.id + ' の復習ドリルが ' + drills + ' 問（3 問以上を推奨）');
    u.prereq.forEach((pr) => { if (!JK.units[pr]) err('単元 ' + u.id + ' の prereq が未定義: ' + pr); });
  });
  ['m', 'p'].forEach((pre) => {
    JK.unitList.filter((u) => u.id.startsWith(pre + '-') && u.grade >= 1).forEach((u) => {
      const has = pre === 'm' ? JK.calcs.some((c) => c.unit === u.id) : JK.sims.some((c) => c.unit === u.id);
      if (!has && !(pre === 'p' && u.id === 'p-force0')) warn('網羅性: 単元 ' + u.id + ' に対応する' + (pre === 'm' ? '計算機' : 'シミュレーター') + 'がない');
    });
  });
}

/* ---------- 出力 ---------- */
stats.forEach((s) => {
  const parts = [];
  ['problems', 'passages', 'calcs', 'sims', 'dict', 'idioms', 'grammar'].forEach((k) => { if (s[k]) parts.push(k + '=' + s[k]); });
  console.log('  ' + s.f + ': ' + (parts.join(', ') || '(登録なし)'));
});
if (flags.has('--inventory')) {
  const inv = {};
  JK.problems.forEach((p) => { const k = p.subject + ' / ' + p.level + ' / ' + p.unit; inv[k] = (inv[k] || 0) + 1; });
  Object.keys(inv).sort().forEach((k) => console.log('    ' + k + ': ' + inv[k]));
  console.log('    calcs=' + JK.calcs.length + ' sims=' + JK.sims.length + ' dict=' + JK.dict.count + ' idioms=' + JK.dict.idioms.length + ' passages=' + JK.passageList.length);
}
if (!QUIET && warnings.length) {
  console.log('\n警告 ' + warnings.length + ' 件:');
  warnings.slice(0, 200).forEach((w) => console.log('  ⚠ ' + w));
  if (warnings.length > 200) console.log('  … 他 ' + (warnings.length - 200) + ' 件');
}
if (errors.length) {
  console.log('\nエラー ' + errors.length + ' 件:');
  errors.slice(0, 300).forEach((e) => console.log('  ✖ ' + e));
  if (errors.length > 300) console.log('  … 他 ' + (errors.length - 300) + ' 件');
  process.exit(1);
}
console.log('\n✔ エラー 0（警告 ' + warnings.length + '）');
