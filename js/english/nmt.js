/* GOKAKU NAVI — AI 訳（端末内のニューラル翻訳。FuguMT, staka/fugumt-en-ja, CC BY-SA 4.0）
   ・使う人が有効にしたときだけ、初回にモデル（約 146MB）を Hugging Face から取得し、IndexedDB に保存する。以後は通信しない。
   ・計算は Web Worker の中で onnxruntime-web（js/vendor/ort、MIT）を使う。file:// で開いても動くよう、
     実行部品は普通の <script>（文字列・base64）として遅れて読み込み、Worker も Blob URL から作る。
   ・英文の分割は SentencePiece（unigram）を自前で行う（transformers.js の分割は FuguMT と合わない。tools/nmt/ 参照）。
   公開: JK.nmt = { status, isStored, start, translate, cached, clearQueue, remove, on, beams, CREDIT } */
(function (g) {
  'use strict';
  var JK = g.JK;

  var REV = '0997e6ce157c3e784fcfc9917bf57ab4c74dbadc';      // Kadonox/fugumt-en-ja-onnx の固定した版
  var BASE = 'https://huggingface.co/Kadonox/fugumt-en-ja-onnx/resolve/' + REV + '/';
  var FILES = [
    { key: 'enc', path: 'onnx/encoder_model_quantized.onnx', size: 35979078, sha: '60b290662bcb83d7ac1f20749dcbac95d4ff92752389ae418fd514ef0d4ce50b' },
    { key: 'dec', path: 'onnx/decoder_model_merged_quantized.onnx', size: 108678224, sha: '669dbec3443a70f278b9e713598751d0f34d5b0b28aeab8d0f1a9f20ccd87c97' },
    { key: 'spm', path: 'source.spm', size: 768297, sha: '92fcbf6449e47457866ec98891dab09ef625e57d9637fe3fdbbe44fc1a365b6d' },
    { key: 'vocab', path: 'vocab.json', size: 791091, sha: '2c0b445181f51bdea35b976a909ba450447ca9d00a2e8d9c978ae1ef46ef964e' }
  ];
  var TOTAL = FILES.reduce(function (a, f) { return a + f.size; }, 0);
  var DBNAME = 'gokaku-navi-nmt', STORE = 'files';
  var VENDOR = ['js/vendor/ort/ort-src.js', 'js/vendor/ort/ort-wasm.js'];

  var st = { state: 'off', err: '', got: 0, worker: null, starting: null, q: [], busy: false, cache: Object.create(null), subs: [], seq: 0, wait: {} };

  function emit() { st.subs.forEach(function (fn) { try { fn(status()); } catch (e) { /* ignore */ } }); }
  function set(state, err) { st.state = state; st.err = err || ''; emit(); }
  function status() { return { state: st.state, err: st.err, got: st.got, total: TOTAL }; }

  /* ---------- IndexedDB ---------- */
  function db() {
    return new Promise(function (res, rej) {
      if (!g.indexedDB) { rej(new Error('このブラウザは IndexedDB を使えません')); return; }
      var r = g.indexedDB.open(DBNAME, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(STORE); };
      r.onsuccess = function () { res(r.result); };
      r.onerror = function () { rej(r.error || new Error('IndexedDB を開けません')); };
    });
  }
  function idb(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (res, rej) {
        var tx = d.transaction(STORE, mode), os = tx.objectStore(STORE), out = fn(os);
        tx.oncomplete = function () { d.close(); res(out && 'result' in out ? out.result : undefined); };
        tx.onerror = tx.onabort = function () { d.close(); rej(tx.error || new Error('IndexedDB の読み書きに失敗しました')); };
      });
    });
  }
  function keyOf(f) { return REV + ':' + f.key; }
  function getFile(f) { return idb('readonly', function (os) { return os.get(keyOf(f)); }); }
  function putFile(f, buf) { return idb('readwrite', function (os) { os.put(buf, keyOf(f)); }); }
  function isStored() {
    return Promise.all(FILES.map(function (f) { return getFile(f).then(function (b) { return !!b && b.byteLength === f.size; }); }))
      .then(function (a) { return a.every(Boolean); }, function () { return false; });
  }

  /* ---------- 取得（Hugging Face → 検証 → IndexedDB） ---------- */
  function hex(buf) {
    var b = new Uint8Array(buf), s = '';
    for (var i = 0; i < b.length; i++) s += (b[i] < 16 ? '0' : '') + b[i].toString(16);
    return s;
  }
  function download(f, done) {
    return fetch(BASE + f.path, { mode: 'cors', credentials: 'omit' }).then(function (r) {
      if (!r.ok) throw new Error(f.path + ' を取得できません（HTTP ' + r.status + '）');
      var buf = new Uint8Array(f.size), off = 0;
      if (!r.body || !r.body.getReader) return r.arrayBuffer().then(function (a) { st.got = done + a.byteLength; emit(); return a; });
      var rd = r.body.getReader();
      return (function pump() {
        return rd.read().then(function (x) {
          if (x.done) return buf.buffer.slice(0, off);
          if (off + x.value.length > buf.length) throw new Error(f.path + ' の大きさが想定と違います');
          buf.set(x.value, off);
          off += x.value.length;
          st.got = done + off;
          emit();
          return pump();
        });
      })();
    }).then(function (a) {
      if (a.byteLength !== f.size) throw new Error(f.path + ' の大きさが想定と違います（' + a.byteLength + ' バイト）');
      if (!(g.crypto && g.crypto.subtle)) return a;
      return g.crypto.subtle.digest('SHA-256', a).then(function (h) {
        if (hex(h) !== f.sha) throw new Error(f.path + ' の中身が想定と違います（SHA-256 不一致）');
        return a;
      });
    });
  }
  function loadFiles(allowDownload) {
    var out = {}, done = 0;
    st.got = 0;
    return FILES.reduce(function (p, f) {
      return p.then(function () {
        return getFile(f).catch(function () { return null; }).then(function (b) {
          if (b && b.byteLength === f.size) { out[f.key] = b; done += f.size; st.got = done; emit(); return null; }
          if (!allowDownload) throw new Error('モデルがこの端末に保存されていません');
          set('downloading');
          return download(f, done).then(function (a) {
            out[f.key] = a; done += f.size;
            return putFile(f, a).catch(function () { /* 保存できなくても今回は使える */ });
          });
        });
      });
    }, Promise.resolve()).then(function () { return out; });
  }

  /* ---------- 実行部品（js/vendor/ort）を遅れて読み込む ---------- */
  function loadScript(src) {
    return new Promise(function (res, rej) {
      var s = g.document.createElement('script');
      s.src = src;
      s.onload = function () { res(); };
      s.onerror = function () { rej(new Error(src + ' を読み込めません')); };
      g.document.head.appendChild(s);
    });
  }
  function b64ToBuf(b64) {
    var bin = g.atob(b64), n = bin.length, u = new Uint8Array(n);
    for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
    return u.buffer;
  }

  /* ---------- Worker の中身（文字列にして Blob URL から起動する） ---------- */
  function workerMain() {
    var ort = null, enc = null, dec = null, spm = null, vocab = null, inv = [];
    var EOS = 0, UNK = 1, PAD = 32000, V = 32001, NL = 6, NH = 8, HD = 64;

    function readSpm(buf) {
      var b = new Uint8Array(buf), dv = new DataView(buf), td = new TextDecoder(), pieces = [];
      function varint(q) { var x = 0, s = 0, c; do { c = b[q.p++]; x += (c & 0x7f) * Math.pow(2, s); s += 7; } while (c & 0x80); return x; }
      var P = { p: 0 };
      while (P.p < b.length) {
        var key = varint(P), f = key >>> 3, wt = key & 7;
        if (wt === 2) {
          var len = varint(P), end = P.p + len;
          if (f === 1) {
            var sp = { piece: '', score: 0, type: 1 }, Q = { p: P.p };
            while (Q.p < end) {
              var k2 = varint(Q), f2 = k2 >>> 3, w2 = k2 & 7;
              if (w2 === 2) { var l2 = varint(Q); if (f2 === 1) sp.piece = td.decode(b.subarray(Q.p, Q.p + l2)); Q.p += l2; }
              else if (w2 === 5) { if (f2 === 2) sp.score = dv.getFloat32(Q.p, true); Q.p += 4; }
              else if (w2 === 0) { var v = varint(Q); if (f2 === 3) sp.type = v; }
              else if (w2 === 1) Q.p += 8;
            }
            pieces.push(sp);
          }
          P.p = end;
        } else if (wt === 0) varint(P);
        else if (wt === 5) P.p += 4;
        else if (wt === 1) P.p += 8;
      }
      var map = new Map(), maxLen = 0, minScore = 0;
      pieces.forEach(function (x) {
        if (x.type === 1 || x.type === 4) { map.set(x.piece, x.score); maxLen = Math.max(maxLen, Array.from(x.piece).length); minScore = Math.min(minScore, x.score); }
      });
      return function encode(text) {
        var s = Array.from('▁' + text.normalize('NFKC').trim().replace(/\s+/g, '▁')), n = s.length;
        var best = new Array(n + 1).fill(-Infinity), from = new Array(n + 1).fill(-1);
        best[0] = 0;
        for (var i = 0; i < n; i++) {
          if (best[i] === -Infinity) continue;
          var str = '';
          for (var j = i; j < Math.min(n, i + maxLen); j++) {
            str += s[j];
            var sc = map.get(str);
            if (sc !== undefined && best[i] + sc > best[j + 1]) { best[j + 1] = best[i] + sc; from[j + 1] = i; }
          }
          if (from[i + 1] === -1 && best[i] + minScore - 10 > best[i + 1]) { best[i + 1] = best[i] + minScore - 10; from[i + 1] = i; }
        }
        var out = [];
        for (var k = n; k > 0; k = from[k]) out.push(s.slice(from[k], k).join(''));
        return out.reverse();
      };
    }

    function i64(a, dims) { return new ort.Tensor('int64', BigInt64Array.from(a.map(function (x) { return BigInt(x); })), dims); }
    function repeat(t, K) {
      var n = t.data.length, out = new t.data.constructor(n * K);
      for (var k = 0; k < K; k++) out.set(t.data, k * n);
      return new ort.Tensor(t.type, out, [K].concat(t.dims.slice(1)));
    }
    function gather(t, idx) {
      var per = t.data.length / t.dims[0], out = new t.data.constructor(per * idx.length);
      idx.forEach(function (b, k) { out.set(t.data.subarray(b * per, (b + 1) * per), k * per); });
      return new ort.Tensor(t.type, out, [idx.length].concat(t.dims.slice(1)));
    }

    async function translate(text, K) {
      var src = spm(text).map(function (p) { return vocab[p] !== undefined ? vocab[p] : UNK; }).concat([EOS]);
      var S = src.length;
      var eo = await enc.run({ input_ids: i64(src, [1, S]), attention_mask: i64(src.map(function () { return 1; }), [1, S]) });
      var ehs = repeat(eo.last_hidden_state, K), emask = i64(new Array(K * S).fill(1), [K, S]);
      var beams = [], done = [], past = null, encPast = null;
      for (var k = 0; k < K; k++) beams.push({ ids: [PAD], score: k === 0 ? 0 : -Infinity });
      var maxLen = Math.min(256, S * 3 + 10);
      for (var step = 0; step < maxLen; step++) {
        var feeds = { encoder_attention_mask: emask, encoder_hidden_states: ehs };
        feeds.input_ids = i64(beams.map(function (b) { return b.ids[b.ids.length - 1]; }), [K, 1]);
        if (!past) {
          var z = new ort.Tensor('float32', new Float32Array(0), [K, NH, 0, HD]);
          for (var l = 0; l < NL; l++) ['decoder', 'encoder'].forEach(function (a) { ['key', 'value'].forEach(function (kv) { feeds['past_key_values.' + l + '.' + a + '.' + kv] = z; }); });
          feeds.use_cache_branch = new ort.Tensor('bool', new Uint8Array([0]), [1]);
        } else {
          Object.keys(past).forEach(function (n) { feeds[n] = past[n]; });
          feeds.use_cache_branch = new ort.Tensor('bool', new Uint8Array([1]), [1]);
        }
        var o = await dec.run(feeds), lg = o.logits.data, T = o.logits.dims[1], cand = [];
        for (var kb = 0; kb < K; kb++) {
          if (beams[kb].score === -Infinity) continue;
          var base = (kb * T + (T - 1)) * V, mx = -Infinity, se = 0, v;
          for (v = 0; v < V; v++) if (v !== PAD && lg[base + v] > mx) mx = lg[base + v];
          for (v = 0; v < V; v++) if (v !== PAD) se += Math.exp(lg[base + v] - mx);
          var lse = mx + Math.log(se), top = [];
          for (v = 0; v < V; v++) {
            if (v === PAD) continue;
            var lp = lg[base + v] - lse;
            if (top.length < 2 * K) { top.push([v, lp]); if (top.length === 2 * K) top.sort(function (a, b) { return b[1] - a[1]; }); }
            else if (lp > top[top.length - 1][1]) { top[top.length - 1] = [v, lp]; top.sort(function (a, b) { return b[1] - a[1]; }); }
          }
          top.forEach(function (c) { cand.push({ k: kb, v: c[0], score: beams[kb].score + c[1] }); });
        }
        cand.sort(function (a, b) { return b.score - a.score; });
        var next = [];
        for (var ci = 0; ci < cand.length && next.length < K; ci++) {
          var c = cand[ci], genLen = beams[c.k].ids.length;
          if (c.v === EOS) done.push({ ids: beams[c.k].ids.slice(1), score: c.score / genLen });
          else next.push({ ids: beams[c.k].ids.concat([c.v]), score: c.score, from: c.k });
        }
        done.sort(function (a, b) { return b.score - a.score; });
        if (done.length >= K && (!next.length || next[0].score / next[0].ids.length < done[K - 1].score)) break;
        if (!next.length) break;
        while (next.length < K) next.push({ ids: next[0].ids.slice(), score: -Infinity, from: next[0].from });
        var idx = next.map(function (b) { return b.from; });
        if (step === 0) {
          encPast = {};
          for (var l2 = 0; l2 < NL; l2++) ['key', 'value'].forEach(function (kv) { encPast['past_key_values.' + l2 + '.encoder.' + kv] = o['present.' + l2 + '.encoder.' + kv]; });
        }
        past = {};
        for (var l3 = 0; l3 < NL; l3++) {
          ['key', 'value'].forEach(function (kv) {
            past['past_key_values.' + l3 + '.decoder.' + kv] = gather(o['present.' + l3 + '.decoder.' + kv], idx);
            past['past_key_values.' + l3 + '.encoder.' + kv] = encPast['past_key_values.' + l3 + '.encoder.' + kv];
          });
        }
        beams = next;
      }
      var best = done.length ? done[0] : { ids: beams[0].ids.slice(1) };
      return best.ids.filter(function (x) { return x !== EOS && x !== PAD; }).map(function (x) { return inv[x] || ''; }).join('')
        .replace(/▁/g, ' ').trim().replace(/([^\x00-\x7F]) +(?=[^\x00-\x7F])/g, '$1');
    }

    self.onmessage = async function (ev) {
      var m = ev.data;
      try {
        if (m.type === 'init') {
          var url = URL.createObjectURL(new Blob([m.ortSrc], { type: 'text/javascript' }));
          ort = await import(url);
          ort.env.wasm.numThreads = 1;
          ort.env.wasm.proxy = false;
          ort.env.wasm.wasmBinary = m.wasm;
          var opt = { executionProviders: ['wasm'], graphOptimizationLevel: 'all' };
          enc = await ort.InferenceSession.create(new Uint8Array(m.enc), opt);
          dec = await ort.InferenceSession.create(new Uint8Array(m.dec), opt);
          spm = readSpm(m.spm);
          vocab = JSON.parse(new TextDecoder().decode(m.vocab));
          Object.keys(vocab).forEach(function (k) { inv[vocab[k]] = k; });
          self.postMessage({ type: 'ready' });
        } else if (m.type === 'tr') {
          var t0 = Date.now(), ja = await translate(m.text, m.beams || 4);
          self.postMessage({ type: 'tr', id: m.id, ja: ja, ms: Date.now() - t0 });
        }
      } catch (e) {
        self.postMessage({ type: 'error', id: m.id, message: String((e && e.message) || e) });
      }
    };
  }

  /* ---------- 起動 ---------- */
  function start(opts) {
    opts = opts || {};
    if (st.state === 'ready') return Promise.resolve();
    if (st.starting) return st.starting;
    set('loading');
    st.starting = loadFiles(!!opts.allowDownload).then(function (files) {
      set('loading');
      return (g.JK_ORT_SRC && g.JK_ORT_WASM ? Promise.resolve() : VENDOR.reduce(function (p, s) { return p.then(function () { return loadScript(s); }); }, Promise.resolve()))
        .then(function () {
          var wasm = b64ToBuf(g.JK_ORT_WASM);
          var code = '(' + workerMain.toString() + ')();';
          if (st.worker) { try { st.worker.terminate(); } catch (e0) { /* ignore */ } }
          var w = new g.Worker(URL.createObjectURL(new Blob([code], { type: 'text/javascript' })), { type: 'module' });
          st.worker = w;
          return new Promise(function (res, rej) {
            w.onmessage = function (ev) {
              var m = ev.data;
              if (m.type === 'ready') { res(); return; }
              var cb = st.wait[m.id];
              if (m.type === 'error' && !cb) { rej(new Error(m.message)); return; }
              if (cb) { delete st.wait[m.id]; if (m.type === 'tr') cb.res(m); else cb.rej(new Error(m.message)); }
            };
            w.onerror = function (e) {
              var msg = (e && e.message) || 'AI 訳の計算部品が止まりました';
              if (st.state === 'ready') { st.busy = false; st.wait = {}; clearQueue(); set('error', msg); }
              rej(new Error(msg));
            };
            w.postMessage({ type: 'init', ortSrc: g.JK_ORT_SRC, wasm: wasm, enc: files.enc, dec: files.dec, spm: files.spm, vocab: files.vocab },
              [wasm, files.enc, files.dec, files.spm, files.vocab]);
          });
        });
    }).then(function () {
      st.starting = null;
      set('ready');
      pump();
    }, function (e) {
      st.starting = null;
      if (st.worker) { try { st.worker.terminate(); } catch (e2) { /* ignore */ } st.worker = null; }
      set('error', String((e && e.message) || e));
      throw e;
    });
    return st.starting;
  }

  /* ---------- 訳す（1 文ずつ順番に） ---------- */
  function norm(text) { return String(text).replace(/\s+/g, ' ').trim(); }
  function key(text) { return JK.nmt.beams + '|' + norm(text); }
  function pump() {
    if (st.busy || !st.q.length || st.state !== 'ready') return;
    var it = st.q.shift();
    var k = key(it.text);
    if (st.cache[k] != null) { it.res(st.cache[k]); pump(); return; }
    st.busy = true;
    var id = ++st.seq;
    st.wait[id] = {
      res: function (m) { st.busy = false; st.cache[k] = m.ja; it.res(m.ja); pump(); },
      rej: function (e) { st.busy = false; it.rej(e); pump(); }
    };
    st.worker.postMessage({ type: 'tr', id: id, text: norm(it.text), beams: JK.nmt.beams });
  }
  function translate(text) {
    var k = key(text);
    if (st.cache[k] != null) return Promise.resolve(st.cache[k]);
    return new Promise(function (res, rej) { st.q.push({ text: text, res: res, rej: rej }); pump(); });
  }
  function cached(text) { var v = st.cache[key(text)]; return v == null ? null : v; }
  function clearQueue() {
    var q = st.q;
    st.q = [];
    q.forEach(function (it) { it.rej(new Error('cancelled')); });
  }
  function remove() {
    clearQueue();
    if (st.worker) { try { st.worker.terminate(); } catch (e) { /* ignore */ } st.worker = null; }
    st.busy = false;
    st.wait = {};
    set('off');
    return new Promise(function (res) {
      if (!g.indexedDB) { res(); return; }
      var r = g.indexedDB.deleteDatabase(DBNAME);
      r.onsuccess = r.onerror = r.onblocked = function () { res(); };
    });
  }

  JK.nmt = {
    status: status, isStored: isStored, start: start, translate: translate, cached: cached, clearQueue: clearQueue, remove: remove,
    on: function (fn) { st.subs.push(fn); },
    beams: 4,
    TOTAL: TOTAL,
    CREDIT: 'AI 訳のモデル: <a href="https://huggingface.co/staka/fugumt-en-ja" target="_blank" rel="noopener">FuguMT</a>（staka、' +
      '<a href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja" target="_blank" rel="noopener">CC BY-SA 4.0</a>）の ONNX 版' +
      '（<a href="https://huggingface.co/Kadonox/fugumt-en-ja-onnx" target="_blank" rel="noopener">Kadonox/fugumt-en-ja-onnx</a>）。' +
      '実行: ONNX Runtime Web（MIT）。'
  };
})(typeof window !== 'undefined' ? window : this);
