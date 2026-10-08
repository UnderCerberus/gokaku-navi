/* GOKAKU NAVI — 英語エンジン: 和訳の入口
   JK.en.translate(text) → { sentences:[{ en, ja, method, score, source, ref, gloss, grammar }], vocab, idioms }
     method: exact（内蔵長文と完全一致）/ fuzzy（似た文。構文解析できない文と、つづりの誤りだけの文）/ pattern（構文解析して組み立てた訳）/ gloss（句ごとの直訳）
     ref: 似た内蔵文があるのにエンジンの訳を出したときの参考 { en, ja, title, score }（なければ null）
   JK.en.makeVocabQuiz({ words, level, count, seed }) → 4 択の単語クイズ（問題の配列）
   依存: lemma.js / ja.js / syntax.js（無くても、内蔵長文との照合と辞書引きだけで動く）。外部通信なし。 */
(function (g) {
  'use strict';
  const JK = g.JK;
  const en = JK.en = JK.en || {};

  const MAX_TEXT = 20000;        // 入力の上限（文字）
  const MAX_TOKENS = 70;         // これより長い文は構文解析しない（句ごとの直訳にする）
  const FUZZY_MIN = 0.8;         // 類似文とみなす語の一致率

  const set = (s) => { const o = Object.create(null); s.split(' ').forEach((w) => { if (w) o[w] = true; }); return o; };
  // 語注・重要語に出さない機能語
  const STOP = set('a an the is am are was were be been being to of in on at and or it he she we they i you my your his her our their its ' +
    'this that these those do does did have has had will would can could may might must shall should not no for with by from as but if so ' +
    'than then there them him us me who whom whose which what when where why how s d ll re ve m t ' +
    'too only also very more most every many much some any each other such all both either neither another few several own same just even ' +
    'still yet again ever never always often about into over under after before between through during without within up down out off here ' +
    'now one two three four five six seven eight nine ten according');
  const NEGW = set('not no never none nobody nothing neither nor without hardly few little cannot');
  const POSNAME = { '名': '名詞', '動': '動詞', '形': '形容詞', '副': '副詞', '前': '前置詞', '接': '接続詞', '代': '代名詞', '助': '助動詞', '冠': '冠詞', '間': '間投詞', '数': '数詞' };

  /* ================= 文字列の整形 ================= */

  function plain(s) {
    if (JK.passage && typeof JK.passage.plain === 'function') return JK.passage.plain(s);
    return String(s == null ? '' : s).replace(/\{[bu]\d+:([^{}]*)\}/g, '$1');
  }
  function norm(s) {
    return plain(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  const ABBR = /(?:^|[\s("'])(?:mr|mrs|ms|dr|prof|st|mt|jr|sr|vs|e\.g|i\.e|p\.s|p\.p\.s)\.$/i;   // etc. は次が大文字なら文の区切り（小文字が続くときは下の規則で切らない）

  // 英文を文に分ける（Mr. などの略語では切らない）
  function splitSentences(text) {
    // 追伸（P.S.）は前の行・署名と別の文にする
    const paras = String(text == null ? '' : text).replace(/\r/g, '').replace(/([^\s])[ \t]*\n?[ \t]*(P\.[ \t]?S\.)(?=\s)/g, '$1\n\n$2').split(/\n[ \t]*\n+/), out = [];
    paras.forEach((p0) => {
      const p = p0.replace(/\n/g, ' ').replace(/[ \t]+/g, ' ').trim();
      if (!p) return;
      let start = 0, i = 0;
      const n = p.length;
      while (i < n) {
        const c = p.charAt(i);
        if (c === '.' || c === '!' || c === '?') {
          let j = i + 1;
          while (j < n && /[.!?]/.test(p.charAt(j))) j++;
          while (j < n && /["'”’)\]]/.test(p.charAt(j))) j++;
          let boundary = j >= n || /\s/.test(p.charAt(j));
          const head = p.slice(start, i + 1);
          // 引用の途中（"Demons out! Fortune in!"）では切らない: 開いた引用符が閉じていなければ、閉じる引用符が続くときだけ切る
          const openQ = ((head.match(/"/g) || []).length % 2 === 1) || ((head.match(/“/g) || []).length > (head.match(/”/g) || []).length);
          if (boundary && openQ && !/["”]/.test(p.slice(i + 1, j))) boundary = false;
          if (boundary && c === '.' && (ABBR.test(head) || /(?:^|\s)[A-HJ-Z]\.$/.test(head))) boundary = false;
          if (boundary && c === '.' && j < n && /^\s+[a-z]/.test(p.slice(j, j + 2))) boundary = false;
          // 引用のあとに伝達部が続く（"…?" he asked. / "…!" Tom shouted.）ときは、そこで文を切らない
          // ただし He said, "…." She smiled … のように、伝達部が引用の前にあるときは引用で文が終わる
          const introQ = /\b(?:said|says|asked|asks|cried|shouted|whispered|replied|answered|added|thought|explained|yelled|wrote|writes|told\s+\w+)\s*,?\s*["“][^"”]*$/i.test(p.slice(start, i + 1));
          if (boundary && j < n && j > i + 1 && /["”]/.test(p.slice(i + 1, j)) && !introQ) {
            const rest = p.slice(j, j + 60);
            if (/^\s+[a-z]/.test(rest) || /^\s+(?:[A-Z][\w.]*\s+){1,3}(?:said|says|asked|asks|cried|shouted|whispered|replied|answered|added|thought|explained|laughed|smiled|continued|told|called|yelled|sighed|murmured|muttered|repeated|suggested|warned|admitted|agreed|insisted|complained|wondered)\b/.test(rest)) boundary = false;
          }
          if (boundary) {
            const piece = p.slice(start, j).trim();
            if (piece) out.push(piece);
            start = j;
          }
          i = j;
          continue;
        }
        i++;
      }
      const tail = p.slice(start).trim();
      if (tail) out.push(tail);
    });
    return out;
  }

  /* ================= 翻訳メモリ（内蔵長文の対訳） ================= */

  let TM = null, TMN = -1;
  function memory() {
    const list = JK.passageList || [];
    if (TM && TMN === list.length) return TM;
    const exact = Object.create(null), items = [], index = Object.create(null);
    list.forEach((p) => {
      (p.paras || []).forEach((para) => {
        (para || []).forEach((st) => {
          if (!st || !st.en) return;
          const k = norm(st.en);
          if (!k) return;
          const it = { k: k, toks: k.split(' '), en: plain(st.en), ja: String(st.ja || ''), title: String(p.title || ''), id: p.id };
          if (!exact[k]) exact[k] = it;
          const idx = items.length;
          items.push(it);
          const seen = Object.create(null);
          it.toks.forEach((w) => {
            if (seen[w] || STOP[w]) return;
            seen[w] = 1;
            (index[w] = index[w] || []).push(idx);
          });
        });
      });
    });
    TM = { exact: exact, items: items, index: index };
    TMN = list.length;
    return TM;
  }
  function lcs(a, b) {                          // 最長共通部分列の長さ
    const m = a.length, n = b.length;
    let prev = new Array(n + 1).fill(0), cur = new Array(n + 1).fill(0);
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]);
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }
  // 似た文を探す。否定語や数が食い違う文は、意味が逆になりうるので採らない
  function fuzzy(k, mem) {
    const a = k.split(' ');
    if (a.length < 5) return null;
    const hits = Object.create(null), seen = Object.create(null);
    let distinct = 0;
    a.forEach((w) => {
      if (seen[w] || STOP[w]) return;
      seen[w] = 1; distinct++;
      (mem.index[w] || []).forEach((idx) => { hits[idx] = (hits[idx] || 0) + 1; });
    });
    if (!distinct) return null;
    let best = null;
    Object.keys(hits).forEach((idx) => {
      if (hits[idx] < distinct * 0.6) return;
      const it = mem.items[idx], b = it.toks;
      const big = Math.max(a.length, b.length);
      if (Math.min(a.length, b.length) < big * 0.75) return;
      const score = lcs(a, b) / big;
      if (score < FUZZY_MIN || (best && score <= best.score)) return;
      // 食い違う語に否定語・数があれば不採用
      const ca = Object.create(null), cb = Object.create(null);
      a.forEach((w) => { ca[w] = (ca[w] || 0) + 1; });
      b.forEach((w) => { cb[w] = (cb[w] || 0) + 1; });
      const diff = [];
      Object.keys(ca).forEach((w) => { if (ca[w] !== (cb[w] || 0)) diff.push(w); });
      Object.keys(cb).forEach((w) => { if (!ca[w]) diff.push(w); });
      if (diff.some((w) => NEGW[w] || /\d/.test(w) || /n't$/.test(w))) return;
      best = { it: it, score: score, diff: diff };
    });
    return best;
  }

  // 食い違う語が、入力側ではすべてエンジンの知らない語で、内蔵文側の語のつづり違い（編集距離 2 以内）か。
  // そうなら入力はつづりの誤りとみなし、内蔵文の訳をそのまま使ってよい
  function typoOnly(k, fz, unknown) {
    const mine = set(k), unk = Object.create(null);
    (unknown || []).forEach((w) => { unk[String(w).toLowerCase()] = true; });
    const theirs = fz.diff.filter((w) => !mine[w]);
    const extra = fz.diff.filter((w) => mine[w]);
    return extra.length > 0 && extra.every((w) => unk[w] && theirs.some((v) => editDist(w, v) <= 2));
  }
  function editDist(a, b) {
    if (Math.abs(a.length - b.length) > 2) return 3;
    let prev = [];
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }

  /* ================= 辞書引き・語注 ================= */

  function lookup(w) {
    if (typeof en.lookup === 'function') {
      try { return en.lookup(w) || []; } catch (e) { return []; }
    }
    const words = JK.dict && JK.dict.words;
    const k = String(w).toLowerCase();
    return words && Object.prototype.hasOwnProperty.call(words, k) ? words[k].map((x) => ({ w: x.w, pos: x.pos, ja: x.ja, lv: x.lv, form: '' })) : [];
  }
  function simpleTokens(s) {
    return (plain(s).match(/[A-Za-z]+(?:'[A-Za-z]+)?(?:-[A-Za-z]+)*/g) || []).map((x, i) => ({ s: x, w: x.toLowerCase().replace(/'s$/, ''), k: 'w', i: i }));
  }
  // 語注: 内容語ごとに { w, lemma, pos, ja }。sel は構文解析で選ばれた辞書エントリ（語の番号 → エントリ）
  function glossOf(toks, sel) {
    const out = [], seen = Object.create(null);
    toks.forEach((t) => {
      if (t.k !== 'w' || !t.s || STOP[t.w]) return;
      let e = sel && sel[t.i] ? sel[t.i] : null;
      if (!e) { const es = lookup(t.w); e = es.length ? es[0] : null; }
      if (!e || !e.ja) return;
      const key = t.w + '|' + e.pos;
      if (seen[key]) return;
      seen[key] = 1;
      out.push({ w: t.s, lemma: e.w, pos: e.pos, ja: e.ja, lv: e.lv });
    });
    return out;
  }

  /* ================= 熟語の検出 ================= */

  const BEW = set('am is are was were be been being');
  const GAPSTOP = set('how what where when which who why whether that if because and but or something anything nothing');
  const POSSW = set('my your his her its our their');
  const REFLW = set('myself yourself himself herself itself ourselves themselves oneself');
  let IDM = null, IDMN = -1;
  function idiomTable() {
    const list = (JK.dict && JK.dict.idioms) || [];
    if (IDM && IDMN === list.length) return IDM;
    const by = Object.create(null);
    list.forEach((it) => {
      const pat = String(it.phrase).split(' ').map((x, i) => {
        if (x === '~' || x === '...' || /^[A-D]$/.test(x)) return { ph: 'gap' };
        if (x === "one's") return { ph: 'poss' };
        if (x === 'oneself') return { ph: 'refl' };
        if (x === 'doing') return { ph: 'doing' };
        if (x === 'done') return { ph: 'done' };
        if (x === 'do' && i > 0) return { ph: 'do' };
        if (x === 'be') return { ph: 'be' };
        return { w: x.toLowerCase() };
      });
      const lits = pat.filter((p) => p.w);
      if (!lits.length) return;
      let fi = 0;
      while (fi < pat.length && !pat[fi].w) { if (pat[fi].ph !== 'be') return; fi++; }      // 先頭は語か be
      const rec = { it: it, pat: pat, first: fi, nlit: lits.length };
      (by[pat[fi].w] = by[pat[fi].w] || []).push(rec);
    });
    IDM = by; IDMN = list.length;
    return IDM;
  }
  function lemmaSet(t) {
    if (t.ls) return t.ls;
    const ls = Object.create(null);
    ls[t.w] = true;
    if (typeof en.lemmas === 'function') { try { en.lemmas(t.w).forEach((l) => { ls[l] = true; }); } catch (e) { /* ignore */ } }
    t.ls = ls;
    return ls;
  }
  function formOK(t, ph) {
    const m = en.morph;
    if (!m) return true;
    if (ph === 'do') return m.isBaseVerb(t.w);
    if (ph === 'doing') return m.isIng(t.w);
    if (ph === 'done') return m.isPP(t.w);
    return true;
  }
  // 熟語の型 pat[x..] を語の列 W[k..] に当てる。合えば終わりの位置、合わなければ -1
  function matchPat(rec, W, k, x) {
    const pat = rec.pat;
    for (; x < pat.length; x++) {
      const p = pat[x], t = W[k];
      if (p.ph === 'gap') {
        if (x === pat.length - 1) return k < W.length && !W[k].punct ? k + 1 : -1;       // 末尾の 〜 は、後ろに 1 語以上あればよい
        for (let len = 1; len <= 5 && k + len < W.length; len++) {
          if (W[k + len - 1].punct || GAPSTOP[W[k + len - 1].w]) return -1;   // 〜 は句読点・接続詞・疑問詞をまたがない
          const e = matchPat(rec, W, k + len, x + 1);
          if (e >= 0) return e;
        }
        return -1;
      }
      if (!t) return -1;
      if (p.w) {
        const ok = t.w === p.w || (x === rec.first && lemmaSet(t)[p.w]);
        if (!ok) return -1;
        k++;
      } else if (p.ph === 'be') { if (!BEW[t.w]) return -1; k++; }
      else if (p.ph === 'poss') { if (!POSSW[t.w] && !t.poss) return -1; k++; }
      else if (p.ph === 'refl') { if (!REFLW[t.w]) return -1; k++; }
      else { if (!formOK(t, p.ph)) return -1; k++; }
    }
    return k;
  }
  function findIdioms(toks) {
    const W = [];
    toks.forEach((t, i) => {
      if (t.k === 'w') W.push({ w: t.w });
      else if (t.k === 'pos' && W.length) W[W.length - 1].poss = true;
      else if (t.k === 'p' && /[,;:.!?]/.test(t.w)) W.push({ w: '#' + i, punct: true });   // 句読点（どの語とも一致しない）
    });
    const by = idiomTable(), out = [], seen = Object.create(null);
    const blocked = en.syn && en.syn.blocked ? en.syn.blocked : null;
    for (let i = 0; i < W.length; i++) {
      const keys = Object.keys(lemmaSet(W[i]));
      for (let q = 0; q < keys.length; q++) {
        const list = by[keys[q]];
        if (!list) continue;
        for (let r = 0; r < list.length; r++) {
          const rec = list[r];
          if (seen[rec.it.phrase]) continue;
          const st = i - rec.first;
          if (st < 0) continue;
          if (rec.nlit < 2) continue;                      // 語が 1 つだけの型（have A do など）は誤検出が多いので、構文解析で使われたときだけ出す
          if (blocked && blocked[rec.it.phrase]) continue; // 字義どおりの読みと紛らわしい熟語（come to ~ など）
          if (matchPat(rec, W, st, 0) >= 0) { seen[rec.it.phrase] = 1; out.push(rec.it); }
        }
      }
    }
    // not only A but also B が見つかったら、その一部にすぎない not A but B は出さない
    return seen['not only A but also B'] ? out.filter((it) => it.phrase !== 'not A but B') : out;
  }

  /* ================= 文法ポイント ================= */

  function grammarOf(s, toks, syn) {
    const list = JK.grammar || [];
    if (!list.length) return [];
    const w = toks.filter((t) => t.k === 'w').map((t) => t.w);
    const m = en.morph || null;
    const ctx = {
      text: s,
      low: ' ' + toks.filter((t) => t.k !== 'pos').map((t) => t.w).join(' ') + ' ',
      w: w, n: w.length,
      sp: syn && syn.ok ? syn.sp : '',
      names: syn && syn.ok ? syn.names : [],
      parsed: !!(syn && syn.ok),
      q: /\?\s*["'”’)]*$/.test(s), ex: /!\s*["'”’)]*$/.test(s),
      has: function (nm) { return this.names.indexOf(nm) >= 0; },
      pp: (x) => !!m && m.isPP(x), ing: (x) => !!m && m.isIng(x), base: (x) => !!m && m.isBaseVerb(x), past: (x) => !!m && m.isPast(x),
      adj: (x) => !!m && m.hasPos(x, '形'), noun: (x) => !!m && m.hasPos(x, '名')
    };
    const out = [];
    for (let i = 0; i < list.length && out.length < 6; i++) {
      const gm = list[i];
      if (!gm || typeof gm.test !== 'function') continue;
      let ok = false;
      try { ok = !!gm.test(ctx); } catch (e) { ok = false; }
      if (ok) out.push({ name: gm.name, explain: gm.explain });
    }
    return out;
  }

  /* ================= 和訳 ================= */

  function trOne(s) {
    const mem = memory();
    const k = norm(s);
    const hasSyn = !!(en.syn && en.analyze && en.jp);
    let toks = [], syn = null, sel = {}, usedIdioms = [];
    let ja = '', method = 'gloss', score = null, source = '';
    try { toks = hasSyn ? en.syn.tokenize(plain(s)) : simpleTokens(s); } catch (e) { toks = simpleTokens(s); }
    const hit = k ? mem.exact[k] : null;
    const fz = !hit && k ? fuzzy(k, mem) : null;
    let ref = null;
    if (hit) { ja = hit.ja; method = 'exact'; score = 1; source = hit.title; }
    if (hasSyn && toks.length && toks.length <= MAX_TOKENS) {
      try { syn = en.syn.translate(toks); } catch (e) { syn = null; }
    }
    if (syn && syn.ok) { sel = syn.sel || {}; usedIdioms = syn.idioms || []; }
    // 似た内蔵文の訳をそのまま出すのは、構文解析できない文と、食い違う語がつづりの誤りだけの文に限る。
    // 知っている語が違う文に内蔵文の訳を出すと内容の違う訳になる（The French word "magnet" … → 英語の magnet…）ので、
    // エンジンの訳を出し、似た内蔵文は参考（ref）として添える
    if (fz) {
      const fzScore = Math.round(fz.score * 100) / 100;
      if (!(syn && syn.ok) || typoOnly(k, fz, syn.unknown)) { ja = fz.it.ja; method = 'fuzzy'; score = fzScore; source = fz.it.title + '（内蔵の文: ' + fz.it.en + '）'; }
      else ref = { en: fz.it.en, ja: fz.it.ja, title: fz.it.title, score: fzScore };
    }
    if (!ja) {
      if (syn && syn.ok) { ja = syn.ja; method = syn.unknown && syn.unknown.length ? 'gloss' : 'pattern'; }
      else if (hasSyn && toks.length) {
        try {
          const c = en.syn.chunks(toks);
          ja = c.ja; sel = c.sel || {}; usedIdioms = c.idioms || [];
        } catch (e) { ja = ''; }
        method = 'gloss';
      }
    }
    const gloss = glossOf(toks, sel);
    let idioms = [];
    try { idioms = findIdioms(toks); } catch (e) { idioms = []; }
    usedIdioms.forEach((it) => { if (it && idioms.indexOf(it) < 0) idioms.push(it); });
    // 「it is ~ that ...（強調構文）」は、構文解析で強調構文と判定できた文にだけ出す（形式主語の文と形が同じため）
    const cleft = !!(syn && syn.ok && syn.names.indexOf('cleft') >= 0);
    const said = idioms.some((it) => it.phrase === 'it is said that ~');
    idioms = idioms.filter((it) => it.phrase !== 'it is ~ that ...' || (cleft && !said));
    let grammar = [];
    try { grammar = grammarOf(s, toks, syn); } catch (e) { grammar = []; }
    return {
      sentence: { en: s, ja: ja, method: method, score: score, source: source, ref: ref,
        gloss: gloss.map((x) => ({ w: x.w, lemma: x.lemma, pos: x.pos, ja: x.ja })), grammar: grammar },
      vocab: gloss.filter((x) => Number(x.lv) >= 1).map((x) => ({ w: x.lemma, pos: x.pos, ja: x.ja, lv: x.lv })),
      idioms: idioms.map((it) => ({ phrase: it.phrase, ja: it.ja, lv: it.lv }))
    };
  }

  function translate(text) {
    const out = { sentences: [], vocab: [], idioms: [] };
    const pieces = splitSentences(String(text == null ? '' : text).slice(0, MAX_TEXT));
    // 内蔵長文では、引用符を含む 2〜3 文が 1 つの対訳になっていることがある（"...," she says. "..."）。
    // 続く 2〜3 文をつないだものが対訳と完全一致するなら、まとめて 1 文として扱う。
    const mem = memory();
    const sents = [];
    for (let i = 0; i < pieces.length; i++) {
      let used = 1;
      if (!mem.exact[norm(pieces[i])]) {
        for (let len = 3; len >= 2; len--) {
          if (i + len > pieces.length) continue;
          const joined = pieces.slice(i, i + len).join(' ');
          if (mem.exact[norm(joined)]) { used = len; break; }
        }
      }
      sents.push(pieces.slice(i, i + used).join(' '));
      i += used - 1;
    }
    const vs = Object.create(null), is = Object.create(null);
    sents.forEach((s) => {
      let r;
      try { r = trOne(s); } catch (e) { r = { sentence: { en: s, ja: '', method: 'gloss', score: null, source: '', gloss: [], grammar: [] }, vocab: [], idioms: [] }; }
      out.sentences.push(r.sentence);
      r.vocab.forEach((v) => { const key = v.w + '|' + v.pos; if (!vs[key]) { vs[key] = 1; out.vocab.push(v); } });
      r.idioms.forEach((v) => { if (!is[v.phrase]) { is[v.phrase] = 1; out.idioms.push(v); } });
    });
    // 前の文に合わせた応答: "Would you mind …?" "Not at all." → いいですよ（どういたしまして ではない）
    out.sentences.forEach((x, i) => {
      if (i === 0 || x.method === 'exact') return;
      const prev = norm(out.sentences[i - 1].en), cur = norm(x.en);
      if (/^(?:not at all|of course not|no not at all|certainly not)$/.test(cur) && /\b(?:would|do) you mind\b/.test(prev)) x.ja = 'ええ、いいですよ。';
    });
    return out;
  }

  /* ================= 単語クイズ ================= */

  let POOL = null, POOLN = -1;
  function pools() {                             // 品詞ごと・レベルごとの辞書エントリ
    const n = JK.dict ? JK.dict.count : 0;
    if (POOL && POOLN === n) return POOL;
    const byPos = Object.create(null), byLv = { 0: [], 1: [], 2: [], 3: [] };
    const words = (JK.dict && JK.dict.words) || {};
    Object.keys(words).sort().forEach((k) => {
      if (/[ .']/.test(k)) return;
      words[k].forEach((e, i) => {
        if (!POSNAME[e.pos]) return;
        (byPos[e.pos] = byPos[e.pos] || []).push(e);
        if (i === 0 && '名動形副'.indexOf(e.pos) >= 0 && byLv[e.lv]) byLv[e.lv].push(e);
      });
    });
    POOL = { byPos: byPos, byLv: byLv };
    POOLN = n;
    return POOL;
  }
  function sensesOf(ja) { return String(ja).split(/[;；]/).map((x) => x.replace(/[〜~()（）\s]/g, '')).filter(Boolean); }
  function overlap(a, b) {
    const sa = sensesOf(a), sb = sensesOf(b);
    return sa.some((x) => sb.some((y) => x === y || (x.length >= 2 && y.indexOf(x) >= 0) || (y.length >= 2 && x.indexOf(y) >= 0)));
  }
  function makeVocabQuiz(opts) {
    opts = opts || {};
    if (!JK.dict || !JK.dict.count || !JK.util || typeof JK.util.rng !== 'function') return [];
    const count = Math.max(1, Math.min(20, Math.floor(Number(opts.count) || 5)));
    const level = Math.max(1, Math.min(3, Math.round(Number(opts.level) || 2)));
    const rng = JK.util.rng(opts.seed == null ? undefined : Number(opts.seed));
    const P = pools();
    let targets = [];
    if (Array.isArray(opts.words) && opts.words.length) {
      const seen = Object.create(null);
      opts.words.forEach((w) => {
        const es = lookup(String(w == null ? '' : w).trim());
        const e = es.length ? es[0] : null;
        if (e && e.ja && POSNAME[e.pos] && !seen[e.w]) { seen[e.w] = 1; targets.push(e); }
      });
      targets = rng.shuffle(targets).slice(0, count);
    } else {
      let pool = P.byLv[level].slice();
      if (pool.length < count) pool = pool.concat(P.byLv[level === 3 ? 2 : level + 1], P.byLv[level === 1 ? 2 : level - 1]);
      targets = rng.shuffle(pool).slice(0, count);
    }
    return targets.map((e) => {
      // 誤答: 同じ品詞・近いレベルで、語義が重ならない語
      const cand = rng.shuffle((P.byPos[e.pos] || []).filter((d) => d.w !== e.w && Math.abs(d.lv - e.lv) <= 1 && !overlap(d.ja, e.ja)));
      const ds = [];
      for (let i = 0; i < cand.length && ds.length < 3; i++) {
        if (!ds.some((d) => overlap(d.ja, cand[i].ja) || d.w === cand[i].w)) ds.push(cand[i]);
      }
      if (ds.length < 3) {                         // 品詞が少ない語は、ほかの品詞からも補う
        const more = rng.shuffle(P.byLv[Math.max(1, Math.min(3, e.lv || 1))].filter((d) => d.w !== e.w && !overlap(d.ja, e.ja)));
        for (let i = 0; i < more.length && ds.length < 3; i++) if (!ds.some((d) => d.w === more[i].w || overlap(d.ja, more[i].ja))) ds.push(more[i]);
      }
      const order = rng.shuffle([e].concat(ds));
      const answer = order.indexOf(e);
      const pn = POSNAME[e.pos];
      const related = ((JK.dict && JK.dict.idioms) || []).filter((it) => (' ' + it.phrase.toLowerCase() + ' ').indexOf(' ' + e.w + ' ') >= 0).slice(0, 2);
      const solution = [
        { t: '語の意味', n: '**' + e.w + '**（' + pn + '）は「' + e.ja + '」という意味です。' },
        { t: 'ほかの選択肢', n: ds.map((d) => '「' + d.ja + '」は **' + d.w + '**').join('、') + ' の意味です。意味の違いもあわせて確認しましょう。' }
      ];
      if (related.length) solution.push({ t: 'この語を使う熟語', n: related.map((it) => '**' + it.phrase + '** = ' + it.ja).join('\n') });
      return {
        title: '単語クイズ',
        word: e.w,
        body: '次の英単語の意味として最も適切なものを選びなさい。\n\n**' + e.w + '**（' + pn + '）',
        parts: [{ type: 'choice', choices: order.map((x) => x.ja), answer: answer, explain: '**' + e.w + '**（' + pn + '）= ' + e.ja }],
        solution: solution
      };
    });
  }

  en.translate = translate;
  en.makeVocabQuiz = makeVocabQuiz;
  en.splitSentences = splitSentences;
})(typeof window !== 'undefined' ? window : globalThis);
