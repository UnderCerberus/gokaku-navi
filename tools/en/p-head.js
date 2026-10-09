'use strict';
// 直前のコミット（HEAD）のエンジンと作業中のエンジンで同じ文を訳し、違う文だけ並べる:
//   node tools/en/p-head.js "文1|文2|…" [--all]（--all なら同じ訳の文も出す）
// 熟語・辞書（js/data）は作業中のものを両方で使う。syntax.js だけを HEAD と比べる。
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const load = require('./load.js');
const root = path.join(__dirname, '..', '..');
const tmp = path.join(__dirname, '.p-head-syntax.js');
const all = process.argv.includes('--all');
const sents = process.argv.slice(2).filter((x) => x !== '--all').join(' ').split('|').map((x) => x.trim()).filter(Boolean);
fs.writeFileSync(tmp, execSync('git show HEAD:js/english/syntax.js', { cwd: root, maxBuffer: 64 * 1024 * 1024 }));
try {
  const base = ['js/data/passages-sample.js', 'js/english/lemma.js', 'js/english/ja.js'];
  const NEW = load(base.concat(['js/english/syntax.js', 'js/english/grammar.js'])).en.syn;
  const OLD = load(base.concat([path.relative(root, tmp).replace(/\\/g, '/'), 'js/english/grammar.js'])).en.syn;
  const tr = (syn, s) => { const t = syn.tokenize(s); let r; try { r = syn.translate(t) || { ok: false }; } catch (e) { r = { ok: false, err: e.message }; } return r.ok ? r.ja : '× ' + (r.err || '(null)'); };
  sents.forEach((s) => {
    const a = tr(OLD, s), b = tr(NEW, s);
    if (a === b && !all) return;
    console.log((a === b ? '= ' : '≠ ') + s + '\n   旧 ' + a + (a === b ? '' : '\n   新 ' + b));
  });
} finally {
  fs.unlinkSync(tmp);
}
