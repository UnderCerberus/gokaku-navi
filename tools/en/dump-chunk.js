'use strict';
// 内蔵長文の訳（snap/dump.txt）を順に区切って表示する（通読用）
// 使い方: node tools/en/dump-chunk.js 開始番号 件数   例: node tools/en/dump-chunk.js 0 50
const fs = require('fs');
const path = require('path');
const L = fs.readFileSync(path.join(__dirname, 'snap', 'dump.txt'), 'utf8').split('\n');
const pairs = [];
for (let i = 0; i < L.length; i++) {
  if (/^\d+ [○×]/.test(L[i]) && L[i + 1] && /^\s+→/.test(L[i + 1])) pairs.push(L[i].replace(/^\d+ /, '') + '\n   ' + L[i + 1].trim());
}
const a = Number(process.argv[2] || 0), n = Number(process.argv[3] || 50);
console.log('全 ' + pairs.length + ' 文 / ' + a + '〜' + (Math.min(pairs.length, a + n) - 1));
pairs.slice(a, a + n).forEach((x, k) => console.log((a + k) + ' ' + x));
