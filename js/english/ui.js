/* GOKAKU NAVI — 英語和訳ツールの UI
   公開は JK.en.mount(el) だけ。読み込み時には DOM に触らない。
   和訳ロジック（JK.en.translate / makeVocabQuiz / lookup）は別ファイル。未定義・例外でも UI が壊れないよう、
   内蔵長文との照合 + 辞書の語注による簡易フォールバックをこのファイルに持つ。
   固有スタイルは css/english.css（.en-tool 配下）。 */
(function (g) {
  'use strict';
  var JK = g.JK;

  /* ================= 定数 ================= */

  var MAX_LEN = 8000;          // 入力の上限（文字）
  var DEBOUNCE = 400;          // 自動和訳の待ち時間（ms）
  var LV = {
    0: { t: '基本', c: '' },
    1: { t: '基礎', c: 'b-basic' },
    2: { t: '標準', c: 'b-mid' },
    3: { t: '難関', c: 'b-adv' }
  };
  var LV_NUM = { basic: 1, mid: 2, adv: 3 };
  var GROUPS = [['basic', '基礎レベル'], ['mid', '中堅レベル'], ['adv', '難関レベル'], ['drill', '復習ドリル']];
  var METHOD = {
    exact: { t: '完全一致', c: 'b-ok' },
    fuzzy: { t: '類似文', c: 'b-mid' },
    pattern: { t: '構文パターン', c: '' },
    gloss: { t: '辞書直訳（参考）', c: 'b-warn' }
  };
  var METHOD_NOTE = {
    fuzzy: '内蔵の長文にある似た文の訳をもとにしています。違う語は下の語注で確認してください。',
    pattern: '構文パターンに当てはめて作った訳です。',
    gloss: '辞書の語義をつないだ参考訳です。語注と文法ポイントを見て、自分で意味を確かめましょう。'
  };
  var EXAMPLES = [
    'It is important for us to learn English.',
    'He is so tired that he cannot walk.',
    'If I had more time, I would travel abroad.',
    'The window was broken by the boy.'
  ];
  var ABBR = /(?:^|[\s("'])(?:mr|mrs|ms|dr|prof|st|jr|sr|vs|e\.g|i\.e)\.$/i;   // 文末の a.m. / p.m. は、次が大文字なら文の区切りとして扱う
  var STOP = Object.create(null);
  ('a an the is am are was were be been being to of in on at and or it he she we they i you my your his her our their ' +
    'this that these those do does did have has had will would can could may might must shall should not no for with by ' +
    'from as but if so than then there its them him us me who which what when where how').split(' ').forEach(function (w) { STOP[w] = 1; });

  /* ================= 状態（再マウントしても入力と結果を保つ） ================= */

  var S = {
    text: '', pid: '',
    result: null, mode: 'engine', why: '',
    open: Object.create(null),       // 展開中の文（正規化した英文がキー）
    vf: 0, vrows: [],                // 重要語の絞り込みレベルと、表示中の行
    qsrc: '', quiz: null,            // 単語クイズ
    lq: '', lrows: null,             // 単語検索
    timer: 0, gen: 0, speaking: false
  };
  var R = null;                      // 現在の描画先（build の戻り値）
  var mem = [];                      // JK.store が無いときの単語帳の退避先

  /* ================= 小物 ================= */

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function rich(s) { return typeof JK.rich === 'function' ? JK.rich(s) : esc(s); }
  function str(x) { return x == null ? '' : String(x); }
  function arr(x) { return Array.isArray(x) ? x : []; }
  var logged = Object.create(null);
  function log(e) {      // 同じ内容の警告は 1 回だけ（エンジンが壊れていても画面とコンソールを荒らさない）
    var k = String(e && e.message ? e.message : e);
    if (logged[k]) return;
    logged[k] = 1;
    try { if (g.console && g.console.warn) g.console.warn('[JK.en.ui]', e); } catch (x) { /* ignore */ }
  }
  function E() { return JK.en || {}; }
  function plain(s) {
    if (JK.passage && typeof JK.passage.plain === 'function') return JK.passage.plain(s);
    return str(s).replace(/\{[bu]\d+:([^{}]*)\}/g, '$1');
  }
  function norm(s) {
    return plain(s).toLowerCase().replace(/[’‘`´]/g, "'").replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim();
  }
  function stripRich(s) { return str(s).replace(/\*\*|__|\$/g, ''); }
  function pct(sc) { return Math.max(0, Math.min(100, Math.round(sc <= 1 ? sc * 100 : sc))); }
  function lvOf(x) { x = Number(x); if (!isFinite(x) || x < 1) return 1; return x > 3 ? 3 : Math.round(x); }
  function lvRaw(x) { x = Number(x); if (!isFinite(x)) return 1; return x < 0 ? 0 : (x > 3 ? 3 : Math.round(x)); }
  function srcText(s) {
    if (!s) return '';
    if (typeof s === 'string') return s;
    if (typeof s === 'object') {
      if (s.id && JK.passages && JK.passages[s.id] && JK.passages[s.id].title) return JK.passages[s.id].title;
      var parts = [];
      ['title', 'univ', 'faculty', 'year', 'no'].forEach(function (k) { if (s[k]) parts.push(String(s[k])); });
      return parts.join(' ');
    }
    return String(s);
  }
  function wordCount(text) { return (str(text).match(/[A-Za-z0-9'’-]+/g) || []).length; }

  /* ================= 内蔵長文（サンプルの選択・翻訳メモリ） ================= */

  function passageText(p) {
    return arr(p.paras).map(function (para) {
      return arr(para).map(function (st) { return plain(st.en); }).join(' ');
    }).join('\n\n');
  }
  function passageOptions() {
    var list = arr(JK.passageList), by = Object.create(null), h;
    list.forEach(function (p) {
      var k = GROUPS.some(function (gp) { return gp[0] === p.level; }) ? p.level : 'other';
      (by[k] = by[k] || []).push(p);
    });
    h = '<option value="">サンプル長文を選ぶ（' + list.length + ' 本）</option>';
    GROUPS.concat([['other', 'その他']]).forEach(function (gp) {
      var ps = by[gp[0]];
      if (!ps || !ps.length) return;
      h += '<optgroup label="' + esc(gp[1]) + '">';
      ps.forEach(function (p) {
        var n = JK.passage && typeof JK.passage.wordCount === 'function' ? JK.passage.wordCount(p) : wordCount(passageText(p));
        h += '<option value="' + esc(p.id) + '">' + esc(p.title) + '（' + n + ' 語）</option>';
      });
      h += '</optgroup>';
    });
    return h;
  }
  var tmCache = null;
  function memory() {
    var list = arr(JK.passageList);
    if (tmCache && tmCache.n === list.length) return tmCache.map;
    var map = Object.create(null);
    list.forEach(function (p) {
      arr(p.paras).forEach(function (para) {
        arr(para).forEach(function (st) {
          var k = norm(st.en);
          if (k && !map[k]) map[k] = { ja: str(st.ja), source: str(p.title) };
        });
      });
    });
    tmCache = { n: list.length, map: map };
    return map;
  }

  /* ================= 文の分割・辞書引き・簡易フォールバック ================= */

  function splitSentences(text) {
    var paras = str(text).replace(/\r/g, '').split(/\n[ \t]*\n+/), out = [];
    paras.forEach(function (p) {
      p = p.replace(/\n/g, ' ').replace(/[ \t]+/g, ' ').trim();
      if (!p) return;
      var start = 0, i = 0, n = p.length;
      while (i < n) {
        var c = p.charAt(i);
        if (c === '.' || c === '!' || c === '?' || c === '。' || c === '！' || c === '？') {
          var j = i + 1;
          while (j < n && /[.!?。！？]/.test(p.charAt(j))) j++;
          while (j < n && /["'”’)\]]/.test(p.charAt(j))) j++;
          var boundary = j >= n || /\s/.test(p.charAt(j));
          var head = p.slice(start, i + 1);
          if (boundary && c === '.' && (ABBR.test(head) || /(?:^|\s)[A-HJ-Z]\.$/.test(head))) boundary = false;   // Mr. / J. などの略語（代名詞 I は除く）
          if (boundary && c === '.' && j < n && /^\s+[a-z]/.test(p.slice(j, j + 2))) boundary = false;
          if (boundary) {
            var piece = p.slice(start, j).trim();
            if (piece) out.push(piece);
            start = j;
          }
          i = j;
          continue;
        }
        i++;
      }
      var tail = p.slice(start).trim();
      if (tail) out.push(tail);
    });
    return out;
  }

  // JK.en.lookup が使えないときだけ使う、規則変化の簡易的な原形候補（辞書にある語だけが採用される）
  function stems(w) {
    var out = [];
    function add(x) { if (x.length > 1 && out.indexOf(x) < 0) out.push(x); }
    // 1 音節の「子音 + 母音 + 子音 1 つ」（rid, hop）に -ing/-ed が付いて子音が重ならないのは、語末の e が落ちたもの（riding → ride）
    function silentE(b) { return /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(b); }
    function addBase(b) { if (silentE(b)) { add(b + 'e'); add(b); } else { add(b); add(b + 'e'); } }
    if (/ies$/.test(w)) add(w.slice(0, -3) + 'y');
    if (/(?:s|x|z|ch|sh)es$/.test(w)) add(w.slice(0, -2));
    if (/s$/.test(w) && !/ss$/.test(w)) add(w.slice(0, -1));
    if (/ied$/.test(w)) add(w.slice(0, -3) + 'y');
    if (/ed$/.test(w)) { if (/(.)\1ed$/.test(w)) add(w.slice(0, -3)); addBase(w.slice(0, -2)); }
    if (/ing$/.test(w)) { if (/(.)\1ing$/.test(w)) add(w.slice(0, -4)); addBase(w.slice(0, -3)); }
    if (/ly$/.test(w)) add(w.slice(0, -2));
    if (/er$/.test(w)) { add(w.slice(0, -2)); add(w.slice(0, -1)); }
    if (/est$/.test(w)) { add(w.slice(0, -3)); add(w.slice(0, -2)); }
    return out;
  }
  function dictEntries(w) {
    var words = JK.dict && JK.dict.words;
    if (!words || !Object.prototype.hasOwnProperty.call(words, w)) return [];
    return arr(words[w]).map(function (x) { return { w: x.w, pos: x.pos, ja: x.ja, lv: x.lv }; });
  }
  // 辞書を引く。活用形の原形化は JK.en.lookup に任せ、無い・失敗・空のときは辞書を直接引く（簡易の語尾処理つき）
  function lookupWord(w) {
    w = str(w).trim().toLowerCase();
    if (!w) return [];
    if (typeof E().lookup === 'function') {
      var r = null;
      try { r = E().lookup(w); } catch (e) { log(e); }
      if (Array.isArray(r) && r.length) return r.filter(function (x) { return x && x.w; });
    }
    var es = dictEntries(w);
    if (es.length) return es;
    var st = stems(w);
    for (var i = 0; i < st.length; i++) {
      es = dictEntries(st[i]);
      if (es.length) return es;
    }
    return [];
  }
  function tokens(s) { return str(s).match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) || []; }

  function fallbackGloss(sentence) {
    var seen = Object.create(null), out = [];
    tokens(sentence).forEach(function (t) {
      var lw = t.toLowerCase();
      if (seen[lw] || STOP[lw]) return;
      seen[lw] = 1;
      var es = lookupWord(lw);
      if (!es.length) return;
      out.push({ w: t, lemma: es[0].w, pos: es[0].pos, ja: es[0].ja });
    });
    return out;
  }
  function fallbackIdioms(text) {
    var nt = ' ' + norm(text) + ' ', out = [];
    arr(JK.dict && JK.dict.idioms).forEach(function (it) {
      if (!it || !it.phrase || /~|\bone's\b|\boneself\b|\b[A-D]\b|\b(?:do|doing|done|sb|sth)\b/.test(it.phrase)) return;
      if (nt.indexOf(' ' + norm(it.phrase) + ' ') >= 0) out.push({ phrase: it.phrase, ja: it.ja, lv: it.lv });
    });
    return out;
  }
  function fallbackTranslate(text) {
    var out = { sentences: [], vocab: [], idioms: [] };
    try {
      var tm = memory(), seen = Object.create(null);
      splitSentences(text).forEach(function (s) {
        var hit = tm[norm(s)];
        out.sentences.push({
          en: s, ja: hit ? hit.ja : '', method: hit ? 'exact' : 'gloss', score: hit ? 1 : null,
          source: hit ? hit.source : '', gloss: hit ? [] : fallbackGloss(s), grammar: []
        });
        tokens(s).forEach(function (t) {
          var lw = t.toLowerCase();
          if (STOP[lw]) return;
          var es = lookupWord(lw);
          if (!es.length || !(Number(es[0].lv) >= 1)) return;
          var hw = str(es[0].w || lw).toLowerCase();
          if (seen[hw]) return;
          seen[hw] = 1;
          out.vocab.push({ w: es[0].w || lw, pos: es[0].pos, ja: es[0].ja, lv: es[0].lv });
        });
      });
      out.idioms = fallbackIdioms(text);
    } catch (e) { log(e); }
    return out;
  }

  // 和訳エンジンの戻り値を、UI が扱いやすい形にそろえる（形が違えば null）
  function normResult(r) {
    if (!r || typeof r !== 'object' || !Array.isArray(r.sentences)) return null;
    var out = { sentences: [], vocab: [], idioms: [] };
    r.sentences.forEach(function (s) {
      if (s == null) return;
      if (typeof s === 'string') s = { en: s };
      var en = str(s.en);
      if (!en.trim()) return;
      out.sentences.push({
        en: en, ja: str(s.ja), method: str(s.method) || 'gloss',
        score: typeof s.score === 'number' && isFinite(s.score) ? s.score : null,
        source: srcText(s.source),
        ref: s.ref && typeof s.ref === 'object' && str(s.ref.ja).trim() ? {
          en: str(s.ref.en), ja: str(s.ref.ja), title: srcText(s.ref.title),
          score: typeof s.ref.score === 'number' && isFinite(s.ref.score) ? s.ref.score : null
        } : null,
        gloss: arr(s.gloss).filter(Boolean), grammar: arr(s.grammar).filter(Boolean)
      });
    });
    out.vocab = arr(r.vocab).filter(function (v) { return v && v.w; });
    out.idioms = arr(r.idioms).filter(function (v) { return v && v.phrase; });
    return out;
  }
  function compute(text) {
    var r = null;
    S.why = '';
    if (typeof E().translate === 'function') {
      try { r = normResult(E().translate(text)); } catch (e) { log(e); S.why = 'error'; }
      if (!r && !S.why) S.why = 'invalid';
    } else S.why = 'missing';
    if (r) { S.mode = 'engine'; return r; }
    S.mode = 'fallback';
    return fallbackTranslate(text);
  }

  /* ================= 単語帳（JK.store.s.ui.vocabSaved） ================= */

  function savedList() {
    var st = JK.store && JK.store.s;
    if (!st || typeof st !== 'object') return mem;
    var ui = st.ui;
    if (!ui || typeof ui !== 'object') ui = st.ui = {};
    if (!Array.isArray(ui.vocabSaved)) ui.vocabSaved = [];
    return ui.vocabSaved;
  }
  function persist() { try { if (JK.store && typeof JK.store.save === 'function') JK.store.save(); } catch (e) { log(e); } }
  function keyOf(it) { return str(it.w).toLowerCase() + '|' + str(it.pos); }
  function isSaved(it) {
    var k = keyOf(it), list = savedList();
    for (var i = 0; i < list.length; i++) if (list[i] && keyOf(list[i]) === k) return true;
    return false;
  }
  function addSaved(it) {
    if (!it || !str(it.w).trim() || isSaved(it)) return false;
    var list = savedList();
    list.push({ w: str(it.w), pos: str(it.pos), ja: str(it.ja), lv: lvRaw(it.lv), ts: Date.now() });
    if (list.length > 2000) list.splice(0, list.length - 2000);
    persist();
    return true;
  }

  /* ================= 読み上げ ================= */

  function canSpeak() {
    try { return !!(g.speechSynthesis && typeof g.SpeechSynthesisUtterance === 'function'); } catch (e) { return false; }
  }
  function alive() { return !!R && !!R.root && R.root.isConnected !== false; }
  function updateSpeakBtn() { if (R && R.bSpeak) R.bSpeak.textContent = S.speaking ? '停止' : '読み上げ'; }
  function stopSpeak() {
    S.gen++;
    S.speaking = false;
    try { if (canSpeak()) g.speechSynthesis.cancel(); } catch (e) { log(e); }
  }
  function speakList(list) {
    list = arr(list).filter(function (t) { return /[A-Za-z]/.test(str(t)); });
    stopSpeak();
    if (!list.length || !canSpeak()) { updateSpeakBtn(); return; }
    var gen = S.gen, i = 0;
    S.speaking = true;
    updateSpeakBtn();
    (function next() {
      if (gen !== S.gen) return;
      if (i >= list.length || !alive()) { S.speaking = false; updateSpeakBtn(); return; }
      var u;
      try { u = new g.SpeechSynthesisUtterance(list[i++]); } catch (e) { log(e); S.speaking = false; updateSpeakBtn(); return; }
      u.lang = 'en-US';
      u.rate = 0.92;
      u.onend = next;
      u.onerror = function () { if (gen === S.gen) { S.speaking = false; updateSpeakBtn(); } };
      try { g.speechSynthesis.speak(u); } catch (e2) { log(e2); S.speaking = false; updateSpeakBtn(); }
    })();
  }

  /* ================= 描画: 部品 ================= */

  function badge(t, c, title) {
    return '<span class="badge' + (c ? ' ' + c : '') + '"' + (title ? ' title="' + esc(title) + '"' : '') + '>' + esc(t) + '</span>';
  }
  function lvBadge(lv) { var m = LV[lv] || LV[1]; return badge(m.t, m.c); }

  /* ---------- ① 和訳 ---------- */

  function glossOf(s) {
    if (s.gloss.length) return s.gloss;
    if (!s._g) s._g = fallbackGloss(s.en);
    return s._g;
  }
  function glossHtml(s) {
    var gl = glossOf(s), hasJa = !!s.ja.trim(), h = '';
    if (hasJa && METHOD_NOTE[s.method]) h += '<div class="en-gl-note small dim">' + esc(METHOD_NOTE[s.method]) + '</div>';
    // 似た内蔵文があっても語が違う文は、エンジンの訳を出し、内蔵文の対訳を参考として見せる
    if (s.ref) {
      h += '<div class="en-gl-note small dim">参考: 内蔵の長文に似た文があります（' + (s.ref.title ? esc(s.ref.title) + '・' : '') +
        (s.ref.score != null ? '一致率 ' + pct(s.ref.score) + '%' : '') + '）。上の訳は、入力した文を解析して作ったものです。<br>' +
        esc(s.ref.en) + '<br>' + esc(s.ref.ja) + '</div>';
    }
    if (gl.length) {
      h += '<div class="en-gl-h">語注' + (hasJa ? '' : '（辞書）') + '</div><div class="en-scroll"><table class="tbl en-gl"><thead><tr><th>語</th><th>品詞</th><th>意味</th></tr></thead><tbody>';
      gl.forEach(function (x) {
        var w = str(x.w), lem = str(x.lemma);
        h += '<tr><td class="en-w c-w">' + esc(w) +
          (lem && lem.toLowerCase() !== w.toLowerCase() ? '<span class="en-lm"> ← ' + esc(lem) + '</span>' : '') +
          '</td><td class="small c-p">' + esc(x.pos) + '</td><td class="c-j">' + esc(x.ja) + '</td></tr>';
      });
      h += '</tbody></table></div>';
    } else h += '<div class="small dim">この文に、語注をつける語はありません。</div>';
    if (s.grammar.length) {
      h += '<div class="en-gl-h">この文の文法ポイント</div><ul class="en-gp">';
      s.grammar.forEach(function (gp) {
        h += '<li><b>' + esc(gp.name) + '</b>' + (gp.explain ? '：' + rich(gp.explain) : '') + '</li>';
      });
      h += '</ul>';
    }
    return h;
  }
  function sentHtml(s, i) {
    var m = METHOD[s.method] || { t: '和訳', c: '' };
    var label = m.t;
    if (s.method === 'fuzzy' && s.score != null) label += ' 一致率 ' + pct(s.score) + '%';
    var hasJa = !!s.ja.trim();
    var open = !hasJa || !!S.open[norm(s.en)];
    var src = s.source && (s.method === 'exact' || s.method === 'fuzzy') ? s.source : '';
    var h = '<div class="en-sent' + (open ? ' open' : '') + '">';
    h += '<div class="en-sent-top"><span class="en-no">' + (i + 1) + '</span>' + badge(label, m.c) + '<span class="grow"></span>';
    if (canSpeak()) h += '<button type="button" class="btn sm ghost" data-act="say" data-i="' + i + '" aria-label="文 ' + (i + 1) + ' を読み上げ">読む</button>';
    h += '</div>';
    h += '<div class="en-sent-main" role="button" tabindex="0" aria-expanded="' + (open ? 'true' : 'false') + '" data-act="sent" data-i="' + i + '">';
    h += '<div class="en-en">' + esc(s.en) + '</div>';
    if (hasJa) h += '<div class="en-ja' + (s.method === 'gloss' ? ' is-gloss' : '') + '">' + esc(s.ja) + '</div>';
    if (src || hasJa) {
      h += '<div class="en-more small dim">' + (src ? '<span class="en-src">出典: ' + esc(src) + '</span>' : '') +
        (hasJa ? '<span class="en-tgl">語注・文法 ' + (open ? '▲ 閉じる' : '▼ 開く') + '</span>' : '') + '</div>';
    }
    h += '</div>';
    if (open) h += '<div class="en-gloss">' + glossHtml(s) + '</div>';
    return h + '</div>';
  }
  function modeNote() {
    if (S.mode !== 'fallback') return '';
    var why = S.why === 'missing'
      ? '和訳エンジンが読み込まれていないため、簡易モードで動いています。'
      : '和訳エンジンでエラーが起きたため、簡易モードで表示しています。';
    return '<div class="note warn small en-mode">' + why + '内蔵の長文と一致した文は和訳を表示し、それ以外の文は辞書の語注を表示します。</div>';
  }
  function renderTrans() {
    var r = S.result, h = '';
    if (!r || !r.sentences.length) {
      h = '<div class="en-empty"><p>左の欄に英文を入力するか、サンプル長文を選んでください。</p>' +
        '<ul class="small dim"><li>文ごとに和訳が表示されます。文をクリックすると、語注（単語の意味）と文法ポイントが開きます。</li>' +
        '<li>内蔵の長文対訳と一致した文は「完全一致」、似た文は「類似文」、それ以外は構文パターンや辞書から訳を作ります。機械的な訳は参考にとどめ、語注で意味を確かめてください。</li>' +
        '<li>通信は一切せず、すべてこのページの中で処理します。</li></ul></div>';
    } else {
      h += modeNote();
      r.sentences.forEach(function (s, i) { h += sentHtml(s, i); });
    }
    R.trans.innerHTML = h;
  }

  /* ---------- ② 重要単語・熟語 ---------- */

  function vocabRows() {
    var r = S.result, rows = [];
    if (!r) return rows;
    r.vocab.forEach(function (v) { rows.push({ w: str(v.w), pos: str(v.pos), ja: str(v.ja), lv: lvOf(v.lv) }); });
    r.idioms.forEach(function (v) { rows.push({ w: str(v.phrase), pos: '熟語', ja: str(v.ja), lv: lvOf(v.lv) }); });
    return rows;
  }
  function savedHtml() {
    var sv = savedList(), h = '<div class="sec-h">単語帳（' + sv.length + ' 件）</div>';
    if (!sv.length) {
      return h + '<div class="small dim">「単語帳に保存」を押した語がここに溜まります。保存先はこのブラウザの中だけです。</div>';
    }
    h += '<div class="en-saved">';
    for (var i = sv.length - 1; i >= 0; i--) {
      var it = sv[i];
      if (!it) continue;
      h += '<div class="en-sv"><span class="en-w c-w">' + esc(it.w) + '</span><span class="small dim c-p">' + esc(it.pos) + '</span>' +
        '<span class="c-j">' + esc(it.ja) + '</span><span class="c-l">' + lvBadge(lvRaw(it.lv)) + '</span>' +
        '<span class="c-a"><button type="button" class="btn sm ghost" data-act="unsave" data-i="' + i + '" aria-label="' + esc(it.w) + ' を単語帳から削除">削除</button></span></div>';
    }
    h += '</div><div class="row en-sv-act"><button type="button" class="btn sm" data-act="qsaved">単語帳でクイズ</button>' +
      '<button type="button" class="btn sm ghost danger" data-act="unsaveall">すべて削除</button></div>';
    return h;
  }
  function renderVocab() {
    var rows = vocabRows(), cnt = [0, 0, 0, 0], h = '';
    rows.forEach(function (it) { cnt[it.lv]++; });
    if (S.vf && !cnt[S.vf]) S.vf = 0;
    var shown = S.vf ? rows.filter(function (it) { return it.lv === S.vf; }) : rows;
    S.vrows = shown;
    if (!rows.length) {
      h += '<div class="en-empty small dim">' + (S.result ? 'この英文には、取り上げる重要語・熟語がありませんでした。' : '英文を入力すると、重要な単語・熟語がここに並びます。') + '</div>';
    } else {
      h += '<div class="row en-vf" role="group" aria-label="レベルで絞り込み">';
      [[0, 'すべて'], [1, '基礎'], [2, '標準'], [3, '難関']].forEach(function (c) {
        var n = c[0] ? cnt[c[0]] : rows.length;
        if (c[0] && !n) return;
        h += '<button type="button" class="chip' + (S.vf === c[0] ? ' on' : '') + '" data-act="vf" data-v="' + c[0] + '" aria-pressed="' + (S.vf === c[0]) + '">' + c[1] + ' <span class="dim">' + n + '</span></button>';
      });
      h += '<span class="grow"></span><button type="button" class="btn sm" data-act="saveall">表示中をすべて単語帳に保存</button></div>';
      h += '<div class="en-scroll"><table class="tbl en-vt"><thead><tr><th>語・熟語</th><th>品詞</th><th>語義</th><th>レベル</th><th>単語帳</th></tr></thead><tbody>';
      shown.forEach(function (it, i) {
        h += '<tr><td class="en-w c-w">' + esc(it.w) + '</td><td class="small c-p">' + esc(it.pos) + '</td><td class="c-j">' + esc(it.ja) + '</td><td class="c-l">' + lvBadge(it.lv) + '</td><td class="en-act c-a">' +
          (isSaved(it) ? '<span class="badge b-ok">保存済</span>' : '<button type="button" class="btn sm" data-act="save" data-i="' + i + '" aria-label="' + esc(it.w) + ' を単語帳に保存">保存</button>') + '</td></tr>';
      });
      h += '</tbody></table></div>';
    }
    h += savedHtml();
    R.vocab.innerHTML = h;
    if (R.vcount) R.vcount.textContent = rows.length ? rows.length + ' 件' : '';
  }

  /* ---------- ③ 文法ポイント ---------- */

  function grammarInfo(name) {
    var list = arr(JK.grammar);
    for (var i = 0; i < list.length; i++) if (list[i] && list[i].name === name) return list[i];
    return null;
  }
  function gradeBadge(level) {
    if (typeof level === 'number' && level >= 1 && level <= 3) return lvBadge(level);
    if (LV_NUM[level]) return lvBadge(LV_NUM[level]);
    return '';
  }
  function renderGrammar() {
    var r = S.result, map = Object.create(null), order = [], h = '';
    if (r) r.sentences.forEach(function (s, i) {
      s.grammar.forEach(function (gp) {
        var nm = str(gp.name);
        if (!nm) return;
        if (!map[nm]) { map[nm] = { name: nm, explain: '', idx: [] }; order.push(nm); }
        if (!map[nm].explain && gp.explain) map[nm].explain = str(gp.explain);
        if (map[nm].idx.indexOf(i + 1) < 0) map[nm].idx.push(i + 1);
      });
    });
    if (!order.length) {
      h = '<div class="en-empty small dim">' + (S.result ? 'この英文から取り上げる文法ポイントは見つかりませんでした。' : '英文を入力すると、使われている文法ポイントがここに並びます。') + '</div>';
    } else {
      order.forEach(function (nm) {
        var it = map[nm], info = grammarInfo(nm), ex = info && info.example;
        var explain = it.explain || (info && info.explain) || '';
        h += '<div class="en-gram"><div class="en-gram-h"><b>' + esc(nm) + '</b>' + (info ? gradeBadge(info.level) : '') +
          '<span class="small dim">文 ' + it.idx.slice(0, 10).join('・') + (it.idx.length > 10 ? ' ほか ' + (it.idx.length - 10) + ' 文' : '') + '</span></div>';
        if (explain) h += '<div class="en-gram-b">' + rich(explain) + '</div>';
        if (ex && ex.en) h += '<div class="en-gram-ex"><span class="small dim">例文</span><div class="en-en">' + esc(ex.en) + '</div>' + (ex.ja ? '<div class="en-ja">' + esc(ex.ja) + '</div>' : '') + '</div>';
        h += '</div>';
      });
    }
    R.gram.innerHTML = h;
    if (R.gcount) R.gcount.textContent = order.length ? order.length + ' 件' : '';
  }

  /* ---------- ④ 単語クイズ ---------- */

  function levelNum() {
    try {
      var p = JK.store && JK.store.s && JK.store.s.profile;
      var id = (p && p.levelOverride) || (typeof JK.levelOf === 'function' ? JK.levelOf(p && p.target) : 'mid');
      return LV_NUM[id] || 2;
    } catch (e) { return 2; }
  }
  function quizWordsFrom(src) {
    var words = [], seen = Object.create(null);
    function add(w) { w = str(w).trim(); if (w && !seen[w.toLowerCase()]) { seen[w.toLowerCase()] = 1; words.push(w); } }
    if (src === 'text') {
      if (S.result) S.result.vocab.forEach(function (v) { add(v.w); });
    } else if (src === 'saved') {
      savedList().forEach(function (it) { if (it && !/\s/.test(str(it.w).trim())) add(it.w); });
    }
    return words;
  }
  function curSrc() {
    if (S.qsrc) return S.qsrc;
    if (S.result && S.result.vocab.length) return 'text';
    return savedList().length ? 'saved' : 'random';
  }
  function validQuiz(q) {
    var p = q && q.parts && q.parts[0];
    return !!(p && Array.isArray(p.choices) && p.choices.length >= 2 && typeof p.answer === 'number' && p.answer >= 0 && p.answer < p.choices.length);
  }
  function choiceText(c) { return typeof c === 'string' ? c : (c && c.t ? String(c.t) : ''); }

  function quizIdleHtml() {
    var src = curSrc(), nText = quizWordsFrom('text').length, nSaved = quizWordsFrom('saved').length;
    var h = '<div class="small dim">辞書の語義を 4 択で確認します（5 問。回答は学習記録に反映されます）。出題する語:</div>';
    h += '<div class="row en-qsrc" role="group" aria-label="出題する語">';
    [['text', '今の英文の重要語', nText], ['saved', '単語帳の語', nSaved], ['random', '辞書からおまかせ', null]].forEach(function (c) {
      h += '<button type="button" class="chip' + (src === c[0] ? ' on' : '') + '" data-act="qsrc" data-v="' + c[0] + '" aria-pressed="' + (src === c[0]) + '">' + c[1] +
        (c[2] != null ? ' <span class="dim">' + c[2] + '</span>' : '') + '</button>';
    });
    h += '</div><div class="row"><button type="button" class="btn primary" data-act="qstart">5 問出題する</button></div>';
    if (S.quiz && S.quiz.error) h += '<div class="note warn small en-q-err">' + esc(S.quiz.error) + '</div>';
    return h;
  }
  function quizItemHtml(Q) {
    var item = Q.items[Q.idx], p = item.parts[0], answered = Q.picked >= 0, n = Q.items.length;
    var h = '<div class="en-q"><div class="row small dim"><span>問 ' + (Q.idx + 1) + ' / ' + n + '</span><span class="grow"></span><span>正解 ' + Q.score + '</span></div>';
    h += '<div class="bar"><i style="width:' + Math.round((Q.idx + (answered ? 1 : 0)) / n * 100) + '%"></i></div>';
    h += '<div class="en-q-body">' + rich(item.body) + '</div><div class="choices en-choices">';
    p.choices.forEach(function (c, i) {
      var cls = 'choice en-choice';
      if (answered && i === p.answer) cls += ' is-ans';
      else if (answered && i === Q.picked) cls += ' is-wrong';
      h += '<button type="button" class="' + cls + '" data-act="qpick" data-i="' + i + '"' + (answered ? ' disabled' : '') + '><span class="c-no">' + (i + 1) + '</span><span>' + rich(choiceText(c)) + '</span></button>';
    });
    h += '</div>';
    if (answered) {
      var ok = Q.picked === p.answer;
      h += '<div class="verdict ' + (ok ? 'ok' : 'ng') + '"><span class="mark">' + (ok ? '○' : '×') + '</span><div>' +
        (ok ? '正解です。' : '不正解です。正解は ' + (p.answer + 1) + ' 番です。') + '</div></div>';
      if (p.explain) h += '<div class="en-q-exp">' + rich(p.explain) + '</div>';
      if (arr(item.solution).length && JK.steps && typeof JK.steps.render === 'function') {
        h += '<details class="en-q-sol"><summary>くわしい解説</summary>' + JK.steps.render(item.solution, 'normal') + '</details>';
      }
      h += '<div class="row en-q-nav"><button type="button" class="btn primary" data-act="qnext">' + (Q.idx + 1 < n ? '次の問題' : '結果を見る') + '</button></div>';
    }
    return h + '</div>';
  }
  function quizDoneHtml(Q) {
    var n = Q.items.length, wrong = Q.log.filter(function (x) { return !x.ok; });
    var h = '<div class="result-banner en-q-res"><h4>結果: ' + Q.score + ' / ' + n + ' 問正解</h4><div class="small dim">' +
      (Q.score === n ? '全問正解です。' : '間違えた語は単語帳に保存して、もう一度確かめましょう。') + '</div></div><ul class="en-q-log">';
    Q.log.forEach(function (x) {
      h += '<li><span class="badge ' + (x.ok ? 'b-ok' : 'b-ng') + '">' + (x.ok ? '○' : '×') + '</span> <span class="en-w">' + esc(x.word) + '</span>' +
        (x.ja ? ' <span class="small dim">' + esc(x.ja) + '</span>' : '') + '</li>';
    });
    h += '</ul><div class="row en-q-nav">';
    if (wrong.length) h += '<button type="button" class="btn" data-act="qsavewrong">間違えた語を単語帳に保存</button>';
    h += '<button type="button" class="btn primary" data-act="qagain">別の 5 問に挑戦</button><button type="button" class="btn ghost" data-act="qclose">閉じる</button></div>';
    return h;
  }
  function renderQuiz() {
    var Q = S.quiz, h;
    if (Q && Q.items && Q.items.length) h = Q.done ? quizDoneHtml(Q) : quizItemHtml(Q);
    else h = quizIdleHtml();
    R.quiz.innerHTML = h;
  }
  function quizIdleRefresh() { if (!S.quiz || !S.quiz.items) renderQuiz(); }

  function startQuiz(src) {
    if (src) S.qsrc = src;
    src = curSrc();
    var words = null;
    if (src === 'text' || src === 'saved') {
      words = quizWordsFrom(src);
      if (!words.length) {
        S.quiz = {
          error: src === 'saved'
            ? '単語帳に（1 語の）単語がありません。「単語帳に保存」で語を溜めてください。'
            : '今の英文には重要語がありません。英文を入力するか、「辞書からおまかせ」を選んでください。'
        };
        renderQuiz();
        return;
      }
    }
    if (typeof E().makeVocabQuiz !== 'function') {
      S.quiz = { error: '単語クイズのデータが読み込まれていません。' };
      renderQuiz();
      return;
    }
    var qs = null;
    try { qs = E().makeVocabQuiz({ words: words, level: levelNum(), count: 5, seed: Date.now() & 0xffff }); } catch (e) { log(e); }
    qs = arr(qs).filter(validQuiz);
    if (!qs.length) {
      S.quiz = { error: '出題できる語がありませんでした。別の語で試してください。' };
    } else {
      S.quiz = { items: qs, idx: 0, picked: -1, score: 0, log: [], done: false, src: src };
    }
    renderQuiz();
    scrollTo(R.secQuiz);
  }
  function pickChoice(i) {
    var Q = S.quiz;
    if (!Q || !Q.items || Q.done || Q.picked >= 0) return;
    var item = Q.items[Q.idx], p = item.parts[0];
    if (!(i >= 0 && i < p.choices.length)) return;
    var ok = i === p.answer, word = str(item.word || item.title);
    Q.picked = i;
    if (ok) Q.score++;
    var es = lookupWord(word);
    Q.log.push({ word: word, ok: ok, ja: es[0] ? es[0].ja : stripRich(choiceText(p.choices[p.answer])), item: item });
    try { if (JK.hooks && typeof JK.hooks.vocabAnswered === 'function') JK.hooks.vocabAnswered(word, ok); } catch (e) { log(e); }
    renderQuiz();
  }
  function nextQuiz() {
    var Q = S.quiz;
    if (!Q || !Q.items || Q.picked < 0) return;
    Q.picked = -1;
    Q.idx++;
    if (Q.idx >= Q.items.length) Q.done = true;
    renderQuiz();
  }
  function saveWrong() {
    var Q = S.quiz, n = 0;
    if (!Q || !Q.log) return;
    Q.log.forEach(function (x) {
      if (x.ok) return;
      var es = lookupWord(x.word), e0 = es[0];
      var it = e0 ? { w: e0.w || x.word, pos: e0.pos, ja: e0.ja, lv: e0.lv } : { w: x.word, pos: '', ja: x.ja, lv: 1 };
      if (addSaved(it)) n++;
    });
    renderVocab();
    quizIdleRefresh();
    if (R.quizMsg) R.quizMsg.textContent = n ? n + ' 語を単語帳に保存しました。' : '保存済みの語ばかりでした。';
  }

  /* ---------- 単語を調べる ---------- */

  function doLookup() {
    var q = str(R.lin.value).trim(), rows = [];
    S.lq = q;
    if (!q) { S.lrows = null; renderLook(); return; }
    if (/\s/.test(q)) {
      var nq = norm(q);
      if (nq) arr(JK.dict && JK.dict.idioms).forEach(function (it) {
        if (rows.length < 8 && it && norm(it.phrase).indexOf(nq) >= 0) rows.push({ w: it.phrase, pos: '熟語', ja: it.ja, lv: it.lv });
      });
    } else {
      lookupWord(q).slice(0, 8).forEach(function (it) { rows.push({ w: it.w, pos: it.pos, ja: it.ja, lv: it.lv }); });
    }
    S.lrows = rows;
    renderLook();
  }
  function renderLook() {
    if (S.lrows == null) { R.look.innerHTML = ''; return; }
    if (!S.lrows.length) {
      R.look.innerHTML = '<div class="note small">「' + esc(S.lq) + '」は辞書に見つかりませんでした。綴りを確かめてください。</div>';
      return;
    }
    var h = '<div class="en-lk">';
    S.lrows.forEach(function (it, i) {
      h += '<div class="en-lk-row"><span class="en-w c-w">' + esc(it.w) + '</span><span class="small dim c-p">' + esc(it.pos) + '</span>' +
        '<span class="c-j">' + esc(it.ja) + '</span><span class="c-l">' + lvBadge(lvRaw(it.lv)) + '</span><span class="c-a">' +
        (isSaved(it) ? '<span class="badge b-ok">保存済</span>' : '<button type="button" class="btn sm" data-act="lsave" data-i="' + i + '" aria-label="' + esc(it.w) + ' を単語帳に保存">保存</button>') + '</span></div>';
    });
    R.look.innerHTML = h + '</div>';
  }

  /* ---------- 全体 ---------- */

  function renderStatus() {
    var n = wordCount(S.text);
    R.count.textContent = n ? n + ' 語' : '';
    R.tcount.textContent = S.result && S.result.sentences.length ? S.result.sentences.length + ' 文' : '';
  }
  function renderAll() {
    renderStatus();
    renderTrans();
    renderVocab();
    renderGrammar();
    renderQuiz();
    renderLook();
    updateSpeakBtn();
  }
  function scrollTo(node) {
    try { if (node && typeof node.scrollIntoView === 'function') node.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) { /* ignore */ }
  }
  function isNarrow() {
    try { return !!(g.matchMedia && g.matchMedia('(max-width: 900px)').matches); } catch (e) { return false; }
  }

  /* ================= 実行・操作 ================= */

  function run(explicit) {
    clearTimeout(S.timer);
    S.timer = 0;
    if (!R) return;
    if (!S.text.trim()) {
      S.result = null;
      S.open = Object.create(null);
      renderStatus(); renderTrans(); renderVocab(); renderGrammar(); quizIdleRefresh();
      return;
    }
    S.result = compute(S.text);
    renderStatus(); renderTrans(); renderVocab(); renderGrammar(); quizIdleRefresh();
    if (explicit && isNarrow()) scrollTo(R.secTrans);
  }
  function schedule() {
    clearTimeout(S.timer);
    S.timer = setTimeout(function () { S.timer = 0; run(false); }, DEBOUNCE);
  }
  function setText(text, explicit) {
    S.text = text;
    R.ta.value = text;
    run(explicit);
  }

  var ACT = {
    run: function () { S.text = R.ta.value; run(true); },
    clear: function () {
      stopSpeak();
      S.pid = '';
      R.sel.value = '';
      S.open = Object.create(null);
      setText('', false);
      try { R.ta.focus(); } catch (e) { /* ignore */ }
    },
    speak: function () {
      if (S.speaking) { stopSpeak(); updateSpeakBtn(); return; }
      var list = S.result && S.result.sentences.length ? S.result.sentences.map(function (s) { return s.en; }) : splitSentences(R.ta.value);
      speakList(list);
    },
    say: function (t) {
      var s = S.result && S.result.sentences[Number(t.getAttribute('data-i'))];
      if (s) speakList([s.en]);
    },
    sent: function (t) {
      var s = S.result && S.result.sentences[Number(t.getAttribute('data-i'))];
      if (!s) return;
      var k = norm(s.en), idx = t.getAttribute('data-i'), hadFocus = false;
      try { hadFocus = !!(g.document && g.document.activeElement === t); } catch (e0) { /* ignore */ }
      if (S.open[k]) delete S.open[k]; else S.open[k] = 1;
      renderTrans();
      if (!hadFocus) return;
      try {      // 再描画で失われたフォーカスを同じ文に戻す（キーボード操作のため）
        var again = R.trans.querySelector('[data-act="sent"][data-i="' + idx + '"]');
        if (again && typeof again.focus === 'function') again.focus();
      } catch (e) { /* ignore */ }
    },
    ex: function (t) {
      var text = EXAMPLES[Number(t.getAttribute('data-i'))];
      if (!text) return;
      S.pid = '';
      R.sel.value = '';
      setText(text, true);
    },
    vf: function (t) { S.vf = Number(t.getAttribute('data-v')) || 0; renderVocab(); },
    save: function (t) {
      var it = S.vrows[Number(t.getAttribute('data-i'))];
      if (it && addSaved(it)) { renderVocab(); quizIdleRefresh(); renderLook(); }
    },
    saveall: function () {
      var n = 0;
      S.vrows.forEach(function (it) { if (addSaved(it)) n++; });
      if (n) { renderVocab(); quizIdleRefresh(); renderLook(); }
    },
    unsave: function (t) {
      var list = savedList(), i = Number(t.getAttribute('data-i'));
      if (i >= 0 && i < list.length) { list.splice(i, 1); persist(); renderVocab(); quizIdleRefresh(); renderLook(); }
    },
    unsaveall: function () {
      var list = savedList();
      if (!list.length) return;
      if (typeof g.confirm === 'function' && !g.confirm('単語帳の ' + list.length + ' 件をすべて削除します。よろしいですか？')) return;
      list.length = 0;
      persist();
      renderVocab(); quizIdleRefresh(); renderLook();
    },
    lookup: function () { doLookup(); },
    lsave: function (t) {
      var it = S.lrows && S.lrows[Number(t.getAttribute('data-i'))];
      if (it && addSaved(it)) { renderLook(); renderVocab(); quizIdleRefresh(); }
    },
    qsrc: function (t) { S.qsrc = t.getAttribute('data-v') || ''; if (S.quiz && S.quiz.error) S.quiz = null; renderQuiz(); },
    qstart: function () { S.quiz = null; startQuiz(); },
    qsaved: function () { S.quiz = null; startQuiz('saved'); },
    qpick: function (t) { pickChoice(Number(t.getAttribute('data-i'))); },
    qnext: function () { nextQuiz(); },
    qagain: function () { S.quiz = null; startQuiz(); },
    qclose: function () { S.quiz = null; renderQuiz(); },
    qsavewrong: function () { saveWrong(); }
  };

  function onClick(e) {
    var t = e.target && typeof e.target.closest === 'function' ? e.target.closest('[data-act]') : null;
    if (!t) return;
    var fn = ACT[t.getAttribute('data-act')];
    if (typeof fn !== 'function') return;
    try { fn(t, e); } catch (err) { log(err); }
  }
  function onKey(e) {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    var t = e.target && typeof e.target.closest === 'function' ? e.target.closest('[data-act="sent"]') : null;
    if (!t) return;
    e.preventDefault();
    try { ACT.sent(t); } catch (err) { log(err); }
  }
  function onInput() {
    S.text = R.ta.value;
    renderStatus();
    if (!S.text.trim()) run(false); else schedule();
  }
  function onSelect() {
    var id = R.sel.value, p = id && JK.passages ? JK.passages[id] : null;
    S.pid = id || '';
    if (!p) return;
    setText(passageText(p), true);
  }

  /* ================= マウント ================= */

  function mk(tag, cls, attrs, html) {
    var el = g.document.createElement(tag);
    if (cls) el.className = cls;
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] == null || attrs[k] === false) return;
      el.setAttribute(k, attrs[k] === true ? '' : String(attrs[k]));
    });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function head(title, extra) {
    var h = mk('div', 'card-h'), t = mk('span', null, null, esc(title)), c = mk('span', 'sp small dim');
    h.appendChild(t);
    h.appendChild(c);
    extra.count = c;
    return h;
  }

  function build() {
    var ref = {}, tmp;
    var root = mk('div', 'en-tool'), left = mk('div', 'en-left'), right = mk('div', 'en-right');

    /* --- 左: 入力 --- */
    var cIn = mk('section', 'card en-card');
    cIn.appendChild(head('英文を入力', tmp = {}));
    ref.count = tmp.count;
    ref.ta = mk('textarea', 'inp en-ta', {
      rows: 9, maxlength: MAX_LEN, spellcheck: 'false', autocapitalize: 'off', autocomplete: 'off', lang: 'en',
      placeholder: 'ここに英文を貼り付けるか、入力してください。\n例: It is important for us to learn English.',
      'aria-label': '和訳したい英文'
    });
    ref.ta.value = S.text;
    cIn.appendChild(ref.ta);
    var btns = mk('div', 'row en-btns');
    btns.appendChild(mk('button', 'btn primary', { type: 'button', 'data-act': 'run' }, '和訳する'));
    btns.appendChild(mk('button', 'btn', { type: 'button', 'data-act': 'clear' }, 'クリア'));
    ref.bSpeak = null;
    if (canSpeak()) {
      ref.bSpeak = mk('button', 'btn', { type: 'button', 'data-act': 'speak' }, '読み上げ');
      btns.appendChild(ref.bSpeak);
    }
    cIn.appendChild(btns);
    cIn.appendChild(mk('div', 'small dim en-hint', null, '入力して 0.4 秒たつと自動で和訳します（Ctrl + Enter で今すぐ）。最大 ' + MAX_LEN + ' 字。'));
    var ex = mk('div', 'en-ex');
    ex.appendChild(mk('span', 'small dim', null, '例文'));
    EXAMPLES.forEach(function (t, i) {
      ex.appendChild(mk('button', 'chip', { type: 'button', 'data-act': 'ex', 'data-i': i, title: t }, esc(t)));
    });
    cIn.appendChild(ex);
    var pick = mk('div', 'field en-pick');
    pick.appendChild(mk('label', null, null, 'サンプル長文（内蔵データ）'));
    ref.sel = mk('select', 'sel', { 'aria-label': 'サンプル長文を選ぶ' }, passageOptions());
    ref.sel.value = S.pid;
    pick.appendChild(ref.sel);
    cIn.appendChild(pick);
    left.appendChild(cIn);

    /* --- 左: 単語を調べる --- */
    var cLk = mk('section', 'card en-card');
    cLk.appendChild(head('単語・熟語を調べる', tmp = {}));
    var lkRow = mk('div', 'row en-lkin');
    ref.lin = mk('input', 'inp', { type: 'text', placeholder: '例: studied / take care of', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', lang: 'en', 'aria-label': '調べる単語・熟語' });
    ref.lin.value = S.lq;
    lkRow.appendChild(ref.lin);
    lkRow.appendChild(mk('button', 'btn', { type: 'button', 'data-act': 'lookup' }, '調べる'));
    cLk.appendChild(lkRow);
    ref.look = mk('div', 'en-look');
    cLk.appendChild(ref.look);
    left.appendChild(cLk);

    /* --- 右: 結果 4 セクション --- */
    function section(title, key, countKey) {
      var s = mk('section', 'card en-sec'), t = {};
      s.appendChild(head(title, t));
      ref[countKey] = t.count;
      ref[key] = mk('div', 'en-body');
      s.appendChild(ref[key]);
      right.appendChild(s);
      return s;
    }
    ref.secTrans = section('① 和訳', 'trans', 'tcount');
    section('② 重要単語・熟語', 'vocab', 'vcount');
    section('③ 文法ポイント', 'gram', 'gcount');
    ref.secQuiz = section('④ 単語クイズ', 'quiz', 'qcount');
    ref.quizMsg = ref.qcount;

    root.appendChild(left);
    root.appendChild(right);
    ref.root = root;
    return ref;
  }

  function mount(el) {
    if (!el || !g.document) return;
    clearTimeout(S.timer);
    S.timer = 0;
    stopSpeak();
    R = build();
    var r = R;
    r.root.addEventListener('click', onClick);
    r.root.addEventListener('keydown', onKey);
    r.ta.addEventListener('input', onInput);
    r.ta.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); ACT.run(); }
    });
    r.sel.addEventListener('change', onSelect);
    r.lin.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); doLookup(); } });
    el.innerHTML = '';
    el.appendChild(r.root);
    renderAll();
  }

  JK.en = JK.en || {};
  JK.en.mount = mount;
})(typeof window !== 'undefined' ? window : globalThis);
