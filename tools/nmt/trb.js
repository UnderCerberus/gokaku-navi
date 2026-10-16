// FuguMT を onnxruntime で直接動かす（正しい SentencePiece 分割 + ビーム探索 + KV キャッシュ）
// 使い方: node trb.js [--beams 12] 29 30 ... | node trb.js [--beams 12] --text "文|文"
'use strict';
const fs = require('fs');
const path = require('path');
// NMT_DIR の下に lib/（npm i @huggingface/transformers）・model/・spm/（source.spm・vocab.json）・out/ を置く
const NMT = process.env.NMT_DIR || path.join(__dirname, '..');
const HELD = 'C:/Claude/gokaku-navi/tools/en/heldout';
const ort = require(path.join(NMT, 'lib', 'node_modules', 'onnxruntime-node'));
const makeSpm = require('./spm.js');
const spm = makeSpm(path.join(NMT, 'spm', 'source.spm'));
const vocab = require(path.join(NMT, 'spm', 'vocab.json'));
const inv = [];
for (const k of Object.keys(vocab)) inv[vocab[k]] = k;
const EOS = 0, UNK = 1, PAD = 32000, V = 32001, L = 6, H = 8, HD = 64;
const ONNX = path.join(NMT, 'model', 'Kadonox', 'fugumt-en-ja-onnx', 'onnx');

function i64(arr, dims) { return new ort.Tensor('int64', BigInt64Array.from(arr.map(BigInt)), dims); }
function repeatBatch(t, K) {
  const n = t.data.length;
  const out = new t.data.constructor(n * K);
  for (let k = 0; k < K; k++) out.set(t.data, k * n);
  return new ort.Tensor(t.type, out, [K].concat(t.dims.slice(1)));
}
function gather(t, idx) {
  const per = t.data.length / t.dims[0];
  const out = new t.data.constructor(per * idx.length);
  idx.forEach((b, k) => out.set(t.data.subarray(b * per, (b + 1) * per), k * per));
  return new ort.Tensor(t.type, out, [idx.length].concat(t.dims.slice(1)));
}

async function main() {
  let args = process.argv.slice(2), K = 12;
  if (args[0] === '--beams') { K = Number(args[1]); args = args.slice(2); }
  const opt = { executionMode: 'sequential', graphOptimizationLevel: 'all' };
  const enc = await ort.InferenceSession.create(path.join(ONNX, 'encoder_model_quantized.onnx'), opt);
  const dec = await ort.InferenceSession.create(path.join(ONNX, 'decoder_model_merged_quantized.onnx'), opt);

  async function translate(text) {
    const pieces = spm.encode(text);
    const src = pieces.map((p) => (vocab[p] !== undefined ? vocab[p] : UNK)).concat([EOS]);
    const S = src.length;
    const eo = await enc.run({ input_ids: i64(src, [1, S]), attention_mask: i64(src.map(() => 1), [1, S]) });
    const ehs = repeatBatch(eo.last_hidden_state, K);
    const emask = i64(new Array(K * S).fill(1), [K, S]);
    let beams = Array.from({ length: K }, (_, k) => ({ ids: [PAD], score: k === 0 ? 0 : -Infinity }));
    const done = [];
    let past = null;
    const maxLen = Math.min(256, S * 3 + 10);
    for (let step = 0; step < maxLen; step++) {
      const feeds = { encoder_attention_mask: emask, encoder_hidden_states: ehs };
      if (!past) {
        feeds.input_ids = i64(beams.map((b) => b.ids[b.ids.length - 1]), [K, 1]);
        const z = new ort.Tensor('float32', new Float32Array(0), [K, H, 0, HD]);
        for (let l = 0; l < L; l++) for (const a of ['decoder', 'encoder']) for (const kv of ['key', 'value']) feeds['past_key_values.' + l + '.' + a + '.' + kv] = z;
        feeds.use_cache_branch = new ort.Tensor('bool', [false], [1]);
      } else {
        feeds.input_ids = i64(beams.map((b) => b.ids[b.ids.length - 1]), [K, 1]);
        Object.assign(feeds, past);
        feeds.use_cache_branch = new ort.Tensor('bool', [true], [1]);
      }
      const o = await dec.run(feeds);
      const lg = o.logits.data, T = o.logits.dims[1];
      const cand = [];
      for (let k = 0; k < K; k++) {
        if (beams[k].score === -Infinity) continue;
        const base = (k * T + (T - 1)) * V;
        let mx = -Infinity;
        for (let v = 0; v < V; v++) if (v !== PAD && lg[base + v] > mx) mx = lg[base + v];
        let se = 0;
        for (let v = 0; v < V; v++) if (v !== PAD) se += Math.exp(lg[base + v] - mx);
        const lse = mx + Math.log(se);
        // 上位 2K 語だけ候補にする
        const top = [];
        for (let v = 0; v < V; v++) {
          if (v === PAD) continue;
          const lp = lg[base + v] - lse;
          if (top.length < 2 * K) { top.push([v, lp]); if (top.length === 2 * K) top.sort((a, b) => b[1] - a[1]); }
          else if (lp > top[top.length - 1][1]) { top[top.length - 1] = [v, lp]; top.sort((a, b) => b[1] - a[1]); }
        }
        for (const [v, lp] of top) cand.push({ k, v, score: beams[k].score + lp });
      }
      cand.sort((a, b) => b.score - a.score);
      const next = [];
      for (const c of cand) {
        const genLen = beams[c.k].ids.length; // 生成済み + 今回（開始記号を除く長さ）
        if (c.v === EOS) {
          if (next.length < K) done.push({ ids: beams[c.k].ids.slice(1), score: c.score / genLen });
        } else next.push({ ids: beams[c.k].ids.concat([c.v]), score: c.score, from: c.k });
        if (next.length >= K) break;
      }
      done.sort((a, b) => b.score - a.score);
      if (done.length >= K) {
        const bestRun = next.length ? next[0].score / (next[0].ids.length) : -Infinity;
        if (bestRun < done[K - 1].score) break;
      }
      if (!next.length) break;
      while (next.length < K) next.push({ ids: next[0].ids.slice(), score: -Infinity, from: next[0].from });
      const idx = next.map((b) => b.from);
      past = {};
      for (let l = 0; l < L; l++) {
        for (const kv of ['key', 'value']) {
          past['past_key_values.' + l + '.decoder.' + kv] = gather(o['present.' + l + '.decoder.' + kv], idx);
          const ek = 'present.' + l + '.encoder.' + kv;
          past['past_key_values.' + l + '.encoder.' + kv] = (step === 0) ? o[ek] : (feeds['past_key_values.' + l + '.encoder.' + kv]);
        }
      }
      beams = next;
    }
    const best = done.length ? done[0] : { ids: beams[0].ids.slice(1) };
    return best.ids.filter((x) => x !== EOS && x !== PAD).map((x) => inv[x] || '').join('')
      .replace(/▁/g, ' ').trim().replace(/([^\x00-\x7F]) +(?=[^\x00-\x7F])/g, '$1');
  }

  const jobs = [];
  if (args[0] === '--text') jobs.push({ name: null, sents: args[1].split('|') });
  else for (const n of args) {
    const sents = fs.readFileSync(path.join(HELD, 'batch' + n + '.txt'), 'utf8').split(/\r?\n/).filter((l) => l.trim() && !l.startsWith('#'));
    jobs.push({ name: 'batch' + n, sents });
  }
  for (const job of jobs) {
    const rows = [];
    let ms = 0;
    for (const s of job.sents) {
      const t1 = Date.now();
      const ja = await translate(s);
      const dt = Date.now() - t1;
      ms += dt;
      rows.push(s + '\t' + ja + '\t' + dt);
      if (!job.name) console.log(s + '\n  → ' + ja + '  (' + dt + 'ms)');
    }
    if (job.name) {
      fs.writeFileSync(path.join(NMT, 'out', 'b' + K + '-' + job.name + '.tsv'), rows.join('\n') + '\n');
      console.error(job.name + ' ' + job.sents.length + ' 文 平均 ' + Math.round(ms / job.sents.length) + 'ms');
    }
  }
}
main().catch((e) => { console.error(e); process.exit(1); });
