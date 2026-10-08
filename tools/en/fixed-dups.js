'use strict';
// FIXED_SENT / TIMEPH / LEAD2 / PN / NAME_JA の重複キーを数える（後のキーが前のキーを上書きするので、足す前に確かめる）
// 使い方: node tools/en/fixed-dups.js
const fs = require('fs');
const path = require('path');
const s = fs.readFileSync(path.join(__dirname, '..', '..', 'js', 'english', 'syntax.js'), 'utf8');
const TABLES = ['FIXED_SENT', 'TIMEPH', 'LEAD2', 'PN', 'NAME_JA'];
let total = 0;
TABLES.forEach((name) => {
  const i = s.indexOf('const ' + name + ' = ');
  if (i < 0) return;
  const j = s.indexOf('});', i);
  const body = s.slice(i, j);
  const re = /(?:'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"|([A-Za-z_][A-Za-z0-9_]*))\s*:\s*['"\[]/g;
  const cnt = Object.create(null);
  let m;
  while ((m = re.exec(body))) {
    const k = m[1] !== undefined ? m[1] : (m[2] !== undefined ? m[2] : m[3]);
    cnt[k] = (cnt[k] || 0) + 1;
  }
  const d = Object.keys(cnt).filter((k) => cnt[k] > 1);
  total += d.length;
  console.log(name + ': キー ' + Object.keys(cnt).length + ' / 重複 ' + d.length + (d.length ? '\n  ' + d.join(' | ') : ''));
});
process.exitCode = total ? 1 : 0;
