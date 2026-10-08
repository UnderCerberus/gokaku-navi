'use strict';
// 訳文のスナップショット比較: node snap.js save | node snap.js diff
//   回帰文（t-syn.js all）と内蔵長文 612 文（t-dump.js）の訳を保存し、修正後に「訳が変わった文」だけを並べる。
//   解析の成否（t-syn / t-fail）では見えない、訳の意図しない変化を拾うための道具。
const cp = require('child_process');
const fs = require('fs');
const path = require('path');
const here = __dirname;
const dir = path.join(here, 'snap');
const run = (args) => cp.execFileSync(process.execPath, args, { cwd: here, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
function pairs(text) {
  const m = new Map();
  const ls = text.split(/\r?\n/);
  for (let i = 0; i < ls.length; i++) {
    const l = ls[i];
    if (!/^(?:[○×]|\d+ [○×]) /.test(l)) continue;
    const key = l.replace(/^\d+ /, '').replace(/^[○×] /, '');
    const val = (ls[i + 1] || '').replace(/ \(\d+ms\)/, '').trim();
    m.set(key, (l.match(/[○×]/) || [''])[0] + ' ' + val);
  }
  return m;
}
function collect() {
  return { syn: run(['t-syn.js', 'all']), dump: run(['t-dump.js', '0', '612']) };
}
const mode = process.argv[2] || 'diff';
if (mode === 'save') {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const c = collect();
  fs.writeFileSync(path.join(dir, 'syn.txt'), c.syn);
  fs.writeFileSync(path.join(dir, 'dump.txt'), c.dump);
  console.log('saved: syn ' + pairs(c.syn).size + ' / dump ' + pairs(c.dump).size);
} else {
  const c = collect();
  let n = 0;
  ['syn', 'dump'].forEach((k) => {
    const f = path.join(dir, k + '.txt');
    if (!fs.existsSync(f)) { console.log('(no snapshot: run "node snap.js save" first)'); return; }
    const a = pairs(fs.readFileSync(f, 'utf8')), b = pairs(c[k]);
    b.forEach((v, s) => {
      const u = a.get(s);
      if (u === undefined) return;
      if (u !== v) { n++; console.log('[' + k + '] ' + s + '\n   - ' + u + '\n   + ' + v); }
    });
  });
  console.log('\nchanged ' + n);
}
