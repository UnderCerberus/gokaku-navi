#!/usr/bin/env node
/* 物理シミュレーターの乱数演習を 1 題、文字で表示する（問題文・設問と答え・解説の全ステップ）。
   node tools/exdump.js <simId> <basic|mid|adv> [種] [easy|normal|pro]
   種は tools/simcheck.js の「種 N」と同じ番号（既定 1）。表示の種類を付けると、その表示で見えるステップだけを出す */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const [id, lv, seedArg, depth] = process.argv.slice(2);
if (!id || !lv) { console.log('使い方: node tools/exdump.js <simId> <basic|mid|adv> [種] [easy|normal|pro]'); process.exit(0); }
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const list = [];
html.replace(/<script src="([^"]+)"/g, (m, s) => { if (/^js\/(core|data\/units|physics)/.test(s)) list.push(s); return m; });
const sandbox = { console, setTimeout, clearTimeout, setInterval, clearInterval };
sandbox.window = sandbox; sandbox.globalThis = sandbox; sandbox.navigator = { userAgent: 'node' };
vm.createContext(sandbox);
list.forEach((rel) => vm.runInContext(fs.readFileSync(path.join(ROOT, rel), 'utf8'), sandbox, { filename: rel }));
const JK = sandbox.JK;
const sim = JK.sims.find((x) => x.id === id);
if (!sim) { console.log('シミュレーターがない: ' + id + '\n' + JK.sims.map((x) => x.id).join(' ')); process.exit(1); }

const seed = Number(seedArg || 1);
const ex = sim.exercise(JK.util.rng(seed * 104729 + lv.length), lv);
console.log('■ ' + ex.title + '（' + id + ' ' + lv + ' 種 ' + seed + '）');
console.log(String(ex.body).replace(/<svg[\s\S]*?<\/svg>/g, '[図]'));
(ex.parts || []).forEach((p, i) => {
  console.log('(' + (i + 1) + ') ' + (p.q || '') + ' → ' + JSON.stringify(p.answer) + (p.unit ? ' ' + p.unit : '') + (p.show ? ' [' + p.show + ']' : '') +
    (p.rel ? ' rel=' + p.rel : '') + (p.tol ? ' tol=' + p.tol : '') + (p.hint ? ' hint=' + p.hint : '') + (p.choices ? ' choices=' + JSON.stringify(p.choices) : ''));
  if (p.explain) console.log('     explain: ' + p.explain);
});
const steps = depth ? JK.steps.filter(ex.solution, depth, ex.parts) : ex.solution;
steps.forEach((st, i) => {
  console.log('--- step ' + (i + 1) + ' lv' + (st.lv || 1) + (st.t ? ' ' + st.t : ''));
  [].concat(st.m || []).forEach((m) => console.log('   m: ' + m));
  if (st.n) console.log('   n: ' + st.n);
  if (st.easy && (!depth || depth === 'easy')) console.log('   easy: ' + st.easy);
  if (st.pro && (!depth || depth === 'pro')) console.log('   pro: ' + st.pro);
});
