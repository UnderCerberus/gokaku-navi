// SentencePiece（unigram）の .spm を読んで Viterbi で分割する最小実装
'use strict';
const fs = require('fs');

function readSpm(file) {
  const b = fs.readFileSync(file);
  let p = 0;
  const varint = (buf, pos) => { let x = 0, s = 0, c; do { c = buf[pos.p++]; x += (c & 0x7f) * Math.pow(2, s); s += 7; } while (c & 0x80); return x; };
  const pieces = [];
  const pos = { p: 0 };
  while (pos.p < b.length) {
    const key = varint(b, pos), f = key >>> 3, wt = key & 7;
    if (wt === 2) {
      const len = varint(b, pos), end = pos.p + len;
      if (f === 1) {
        const sp = { piece: '', score: 0, type: 1 };
        const q = { p: pos.p };
        while (q.p < end) {
          const k2 = varint(b, q), f2 = k2 >>> 3, w2 = k2 & 7;
          if (w2 === 2) { const l2 = varint(b, q); if (f2 === 1) sp.piece = b.toString('utf8', q.p, q.p + l2); q.p += l2; }
          else if (w2 === 5) { if (f2 === 2) sp.score = b.readFloatLE(q.p); q.p += 4; }
          else if (w2 === 0) { const v = varint(b, q); if (f2 === 3) sp.type = v; }
          else if (w2 === 1) q.p += 8;
        }
        pieces.push(sp);
      }
      pos.p = end;
    } else if (wt === 0) varint(b, pos);
    else if (wt === 5) pos.p += 4;
    else if (wt === 1) pos.p += 8;
  }
  return pieces;
}

function makeSpm(file) {
  const pieces = readSpm(file);
  const map = new Map();
  let maxLen = 0, minScore = 0;
  for (const sp of pieces) {
    if (sp.type === 1 || sp.type === 4) { map.set(sp.piece, sp.score); maxLen = Math.max(maxLen, [...sp.piece].length); minScore = Math.min(minScore, sp.score); }
  }
  function encode(text) {
    const s = [...('▁' + text.normalize('NFKC').trim().replace(/\s+/g, '▁'))];
    const n = s.length, best = new Array(n + 1).fill(-Infinity), from = new Array(n + 1).fill(-1);
    best[0] = 0;
    for (let i = 0; i < n; i++) {
      if (best[i] === -Infinity) continue;
      let str = '';
      for (let j = i; j < Math.min(n, i + maxLen); j++) {
        str += s[j];
        const sc = map.get(str);
        if (sc !== undefined && best[i] + sc > best[j + 1]) { best[j + 1] = best[i] + sc; from[j + 1] = i; }
      }
      // 未知の 1 文字
      if (best[i] + minScore - 10 > best[i + 1] && from[i + 1] === -1) { best[i + 1] = best[i] + minScore - 10; from[i + 1] = i; }
    }
    const out = [];
    for (let k = n; k > 0; k = from[k]) out.push(s.slice(from[k], k).join(''));
    return out.reverse();
  }
  return { encode, pieces };
}
module.exports = makeSpm;

if (require.main === module) {
  const spm = makeSpm(process.argv[2]);
  for (const t of process.argv.slice(3)) console.log(t, '→', spm.encode(t).join(' | '));
}
