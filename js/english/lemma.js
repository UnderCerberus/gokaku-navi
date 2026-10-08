/* GOKAKU NAVI — 英語エンジン: 活用形の解析と辞書引き
   JK.en.lemmas(word)  活用形 → 原形候補の配列（'studied' → ['study'], 'better' → ['good', 'well']）
   JK.en.analyze(word) → [{ lemma, form, entries }]  form: base | 3sg | pl | past | pp | ing | comp | sup | adv
   JK.en.lookup(word)  → [{ w, pos, ja, lv, form }]（完全一致のエントリ → 原形候補のエントリの順）
   辞書（JK.dict）は呼び出し時に参照する。読み込み時には DOM にも辞書にも触らない。 */
(function (g) {
  'use strict';
  var JK = g.JK;
  var en = JK.en = JK.en || {};

  /* ================= 不規則変化の表 ================= */

  // 「原形:過去形:過去分詞」。別形は / で区切る。変化の型ごとにまとめてある。
  var IRREGULAR_VERBS = [
    // A-A-A 型（3 つとも同じ形）
    'bet:bet:bet bid:bid:bid broadcast:broadcast:broadcast burst:burst:burst cast:cast:cast cost:cost:cost cut:cut:cut',
    'forecast:forecast:forecast hit:hit:hit hurt:hurt:hurt let:let:let put:put:put quit:quit:quit read:read:read',
    'set:set:set shed:shed:shed shut:shut:shut split:split:split spread:spread:spread thrust:thrust:thrust upset:upset:upset',
    // A-B-B 型（過去形と過去分詞が同じ）
    'bend:bent:bent bind:bound:bound bleed:bled:bled breed:bred:bred bring:brought:brought build:built:built',
    'burn:burned/burnt:burned/burnt buy:bought:bought catch:caught:caught cling:clung:clung creep:crept:crept',
    'deal:dealt:dealt dig:dug:dug dream:dreamed/dreamt:dreamed/dreamt dwell:dwelt:dwelt feed:fed:fed feel:felt:felt',
    'fight:fought:fought find:found:found flee:fled:fled fling:flung:flung grind:ground:ground hang:hung:hung',
    'have:had:had hear:heard:heard hold:held:held keep:kept:kept kneel:knelt:knelt lay:laid:laid lead:led:led',
    'lean:leaned/leant:leaned/leant leap:leaped/leapt:leaped/leapt learn:learned/learnt:learned/learnt leave:left:left',
    'lend:lent:lent light:lit/lighted:lit/lighted lose:lost:lost make:made:made mean:meant:meant meet:met:met',
    'mislead:misled:misled misunderstand:misunderstood:misunderstood overhear:overheard:overheard oversleep:overslept:overslept',
    'pay:paid:paid rebuild:rebuilt:rebuilt say:said:said seek:sought:sought sell:sold:sold send:sent:sent',
    'shine:shone:shone shoot:shot:shot sit:sat:sat sleep:slept:slept slide:slid:slid smell:smelled/smelt:smelled/smelt',
    'speed:sped:sped spell:spelled/spelt:spelled/spelt spend:spent:spent spill:spilled/spilt:spilled/spilt spin:spun:spun',
    'spit:spat:spat spoil:spoiled/spoilt:spoiled/spoilt stand:stood:stood stick:stuck:stuck sting:stung:stung',
    'strike:struck:struck/stricken sweep:swept:swept swing:swung:swung teach:taught:taught tell:told:told',
    'think:thought:thought understand:understood:understood uphold:upheld:upheld weep:wept:wept win:won:won',
    'wind:wound:wound withhold:withheld:withheld withstand:withstood:withstood',
    // A-B-A 型（原形と過去分詞が同じ）
    'become:became:become come:came:come overcome:overcame:overcome run:ran:run',
    // A-B-C 型（3 つとも違う形）
    'arise:arose:arisen awake:awoke:awoken bear:bore:born/borne beat:beat:beaten begin:began:begun bite:bit:bitten',
    'blow:blew:blown break:broke:broken choose:chose:chosen do:did:done draw:drew:drawn drink:drank:drunk',
    'drive:drove:driven eat:ate:eaten fall:fell:fallen fly:flew:flown forbid:forbade:forbidden foresee:foresaw:foreseen',
    'forget:forgot:forgotten/forgot forgive:forgave:forgiven freeze:froze:frozen get:got:got/gotten give:gave:given',
    'go:went:gone grow:grew:grown hide:hid:hidden know:knew:known lie:lay/lied:lain/lied mistake:mistook:mistaken',
    'outgrow:outgrew:outgrown overtake:overtook:overtaken overthrow:overthrew:overthrown prove:proved:proven/proved',
    'ride:rode:ridden ring:rang:rung rise:rose:risen see:saw:seen sew:sewed:sewn/sewed shake:shook:shaken',
    'show:showed:shown/showed shrink:shrank:shrunk sing:sang:sung sink:sank:sunk sow:sowed:sown/sowed speak:spoke:spoken',
    'spring:sprang:sprung steal:stole:stolen strive:strove:striven swear:swore:sworn swell:swelled:swollen/swelled',
    'swim:swam:swum take:took:taken tear:tore:torn throw:threw:thrown tread:trod:trodden undergo:underwent:undergone',
    'undertake:undertook:undertaken undo:undid:undone wake:woke:woken wear:wore:worn weave:wove:woven',
    'withdraw:withdrew:withdrawn write:wrote:written rewrite:rewrote:rewritten'
  ].join(' ');

  // 不規則な複数形「複数形:単数形」
  var IRREGULAR_PLURALS = [
    'men:man women:woman children:child feet:foot teeth:tooth mice:mouse geese:goose oxen:ox people:person',
    'lives:life leaves:leaf knives:knife wives:wife wolves:wolf shelves:shelf halves:half thieves:thief loaves:loaf',
    'calves:calf selves:self phenomena:phenomenon criteria:criterion analyses:analysis crises:crisis bases:basis',
    'hypotheses:hypothesis theses:thesis emphases:emphasis oases:oasis diagnoses:diagnosis media:medium',
    'bacteria:bacterium data:datum stimuli:stimulus nuclei:nucleus fungi:fungus heroes:hero potatoes:potato',
    'tomatoes:tomato echoes:echo businessmen:businessman policemen:policeman fishermen:fisherman gentlemen:gentleman'
  ].join(' ');

  // 不規則な比較変化「形:原級(複数可):comp|sup」
  var IRREGULAR_DEGREE = [
    'better:good/well:comp best:good/well:sup worse:bad/ill/badly:comp worst:bad/ill/badly:sup',
    'more:many/much:comp most:many/much:sup less:little:comp least:little:sup',
    'further:far:comp furthest:far:sup farther:far:comp farthest:far:sup elder:old:comp eldest:old:sup'
  ].join(' ');

  // be / have / do の活用形
  var AUX_FORMS = {
    am: ['be', 'pres'], is: ['be', '3sg'], are: ['be', 'pres'], was: ['be', 'past'], were: ['be', 'past'],
    been: ['be', 'pp'], being: ['be', 'ing'],
    has: ['have', '3sg'], had: ['have', 'past'], having: ['have', 'ing'],
    does: ['do', '3sg'], did: ['do', 'past'], done: ['do', 'pp'], doing: ['do', 'ing']
  };

  var FORM_NAME = {
    base: '', pres: '現在形', '3sg': '三人称単数現在', pl: '複数形', past: '過去形', pp: '過去分詞',
    ing: '-ing 形', comp: '比較級', sup: '最上級', adv: '副詞（形容詞 + ly）'
  };
  // 活用形ごとに、引いてよい品詞
  var FORM_POS = {
    pres: ['動', '助'], '3sg': ['動', '助'], past: ['動', '助'], pp: ['動', '助'], ing: ['動', '助'],
    pl: ['名', '数'], comp: ['形', '副'], sup: ['形', '副'], adv: ['形']
  };

  var irr = null;      // 語形 → [{ lemma, form }]
  function table() {
    if (irr) return irr;
    irr = Object.create(null);
    function put(formWord, lemma, form) {
      var list = irr[formWord] || (irr[formWord] = []);
      for (var i = 0; i < list.length; i++) if (list[i].lemma === lemma && list[i].form === form) return;
      list.push({ lemma: lemma, form: form });
    }
    IRREGULAR_VERBS.split(' ').forEach(function (row) {
      var p = row.split(':');
      p[1].split('/').forEach(function (w) { put(w, p[0], 'past'); });
      p[2].split('/').forEach(function (w) { put(w, p[0], 'pp'); });
    });
    IRREGULAR_PLURALS.split(' ').forEach(function (row) {
      var p = row.split(':');
      put(p[0], p[1], 'pl');
    });
    IRREGULAR_DEGREE.split(' ').forEach(function (row) {
      var p = row.split(':');
      p[1].split('/').forEach(function (l) { put(p[0], l, p[2]); });
    });
    Object.keys(AUX_FORMS).forEach(function (w) { put(w, AUX_FORMS[w][0], AUX_FORMS[w][1]); });
    return irr;
  }
  // 規則変化と紛らわしい不規則動詞の原形（-ed を付けない）
  var irrBase = null;
  function irregularBases() {
    if (irrBase) return irrBase;
    irrBase = Object.create(null);
    IRREGULAR_VERBS.split(' ').forEach(function (row) {
      var p = row.split(':');
      if (p[1].indexOf(p[0] + 'ed') < 0 && p[1].indexOf(p[0] + 'd') < 0) irrBase[p[0]] = true;
    });
    irrBase.be = irrBase.have = irrBase['do'] = true;
    return irrBase;
  }

  /* ================= 辞書の参照 ================= */

  function entriesOf(w) {
    var words = JK.dict && JK.dict.words;
    if (!words || !Object.prototype.hasOwnProperty.call(words, w)) return [];
    return words[w] || [];
  }
  function entriesFor(lemma, form) {
    var es = entriesOf(lemma), allow = FORM_POS[form];
    if (!allow) return es.slice();
    return es.filter(function (e) { return allow.indexOf(e.pos) >= 0; });
  }
  function hasPos(lemma, pos) {
    return entriesOf(lemma).some(function (e) { return e.pos === pos; });
  }

  function clean(word) {
    return String(word == null ? '' : word).trim().toLowerCase().replace(/[’‘`´]/g, "'").replace(/'s$|s'$/, function (m) {
      return m === "s'" ? 's' : '';
    });
  }

  /* ================= 規則変化の候補 ================= */

  // 規則変化の語尾を外した候補 [{ lemma, form }]（辞書にあるかどうかはまだ見ない）
  function ruleCandidates(w) {
    var out = [];
    function add(lemma, form) { if (lemma && lemma.length > 1 && lemma !== w) out.push({ lemma: lemma, form: form }); }
    function both(lemma) { add(lemma, 'pl'); add(lemma, '3sg'); }
    var m;
    // -s / -es / -ies
    if (/[^s]s$/.test(w) || /sses$/.test(w)) {
      if (/ies$/.test(w)) { both(w.slice(0, -3) + 'y'); both(w.slice(0, -1)); }
      else if (/(?:s|x|z|ch|sh|o)es$/.test(w)) { both(w.slice(0, -2)); both(w.slice(0, -1)); }
      else both(w.slice(0, -1));
    }
    // -ed
    if (/ed$/.test(w) && w.length > 3) {
      var b = w.slice(0, -2);
      [['past'], ['pp']].forEach(function (f) {
        if (/ied$/.test(w)) add(w.slice(0, -3) + 'y', f[0]);
        if (/(.)\1$/.test(b)) add(b.slice(0, -1), f[0]);      // stopped → stop
        if (/^[^aeiou]*[aeiou][^aeiouwxy]$/.test(b)) add(w.slice(0, -1), f[0]);   // hoped / taped → hope / tape（1 音節の 母音 1 つ + 子音 1 つ は -ed で子音を重ねるので、重ならないなら -e つきの語）
        add(b, f[0]);                                           // walked → walk
        add(w.slice(0, -1), f[0]);                              // loved → love
        if (/ck$/.test(b)) add(b.slice(0, -1), f[0]);           // panicked → panic
      });
    }
    // -ing
    if (/ing$/.test(w) && w.length > 4) {
      var s = w.slice(0, -3);
      if (/ying$/.test(w)) add(w.slice(0, -4) + 'ie', 'ing');   // lying → lie, dying → die
      if (/(.)\1$/.test(s)) add(s.slice(0, -1), 'ing');         // running → run
      // riding / hoping: 1 音節で「母音 1 つ + 子音 1 つ」で終わる語幹（rid / hop）なら -ing で子音を重ねる（ridding）ので、ride / hope を先にする
      var shortCVC = /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(s);
      if (shortCVC) { add(s + 'e', 'ing'); add(s, 'ing'); }
      else { add(s, 'ing'); add(s + 'e', 'ing'); }              // walking → walk / making → make
      if (/ck$/.test(s)) add(s.slice(0, -1), 'ing');
    }
    // 比較級・最上級
    if ((m = /^(.+?)(er|est)$/.exec(w)) && m[1].length > 1) {
      var f2 = m[2] === 'er' ? 'comp' : 'sup', st = m[1];
      if (/i$/.test(st)) add(st.slice(0, -1) + 'y', f2);        // happier → happy
      if (/(.)\1$/.test(st)) add(st.slice(0, -1), f2);          // bigger → big
      add(st, f2);                                              // taller → tall
      add(st + 'e', f2);                                        // larger → large
    }
    // 形容詞 + ly
    if (/ly$/.test(w) && w.length > 4) {
      var a = w.slice(0, -2);
      if (/ily$/.test(w)) add(w.slice(0, -3) + 'y', 'adv');     // happily → happy
      if (/ically$/.test(w)) add(w.slice(0, -4), 'adv');        // basically → basic
      add(a, 'adv');                                            // quickly → quick
      add(a + 'le', 'adv');                                     // simply → simple, possibly → possible
      add(a + 'e', 'adv');                                      // truly → true
      if (/lly$/.test(w)) add(w.slice(0, -1), 'adv');           // fully → full
    }
    return out;
  }

  /* ================= 解析 ================= */

  var cache = Object.create(null), cacheN = -1;

  // 語形の解析結果 [{ lemma, form, entries }]。entries は、その解釈で引ける辞書エントリ
  function analyze(word) {
    var w = clean(word);
    if (!w) return [];
    var n = JK.dict ? JK.dict.count : 0;
    if (n !== cacheN) { cache = Object.create(null); cacheN = n; }
    if (cache[w]) return cache[w];
    var out = [], seen = Object.create(null);
    function push(lemma, form, entries) {
      var k = lemma + '|' + form;
      if (seen[k]) return;
      seen[k] = 1;
      out.push({ lemma: lemma, form: form, entries: entries });
    }
    var exact = entriesOf(w);
    if (exact.length) push(w, 'base', exact.slice());
    var hits = table()[w];
    var isIrregular = !!hits;
    if (hits) hits.forEach(function (h) { push(h.lemma, h.form, entriesFor(h.lemma, h.form)); });
    var exactNoun = exact.some(function (e) { return e.pos === '名'; });
    var bases = irregularBases();
    ruleCandidates(w).forEach(function (c) {
      var es = entriesFor(c.lemma, c.form);
      if (!es.length) return;
      if ((c.form === 'past' || c.form === 'pp') && bases[c.lemma]) return;        // goed, cutted などは作らない
      if ((c.form === 'comp' || c.form === 'sup') && exactNoun) return;            // number を numb の比較級にしない
      if ((c.form === 'comp' || c.form === 'sup') && isIrregular) return;
      if (c.form === 'adv' && exact.some(function (e) { return e.pos === '副'; })) return;
      if (c.form === '3sg') es = es.filter(function (e) { return e.pos === '動'; });
      if (!es.length) return;
      push(c.lemma, c.form, es);
    });
    cache[w] = out;
    return out;
  }

  function lemmas(word) {
    var out = [];
    analyze(word).forEach(function (a) {
      if (a.form === 'base' && !a.entries.length) return;
      if (out.indexOf(a.lemma) < 0) out.push(a.lemma);
    });
    // 完全一致の見出し語があり、ほかに不規則変化の原形もあるときは、原形（活用の元）を先にする: left → ['leave', 'left'] ではなく
    // 見出し語を先に保つ（lookup と同じ順）。
    return out;
  }

  function lookup(word) {
    var out = [], merged = Object.create(null);
    analyze(word).forEach(function (a) {
      a.entries.forEach(function (e) {
        var k = e.w + '|' + e.pos;
        var name = FORM_NAME[a.form] || '';
        if (merged[k]) {
          // 同じエントリに複数の解釈（過去形と過去分詞など）があれば、形の名前をまとめる
          if (name && merged[k].form.indexOf(name) < 0) merged[k].form = merged[k].form ? merged[k].form + '・' + name : name;
          return;
        }
        var item = { w: e.w, pos: e.pos, ja: e.ja, lv: e.lv, form: name };
        merged[k] = item;
        out.push(item);
      });
    });
    return out;
  }

  /* ================= 判定（文法パターン・和訳で使う） ================= */

  function hasForm(word, form) {
    return analyze(word).some(function (a) { return a.form === form; });
  }
  function verbForm(word, form) {
    var w = clean(word);
    return analyze(w).some(function (a) {
      if (a.form !== form) return false;
      if (form === 'base') return a.entries.some(function (e) { return e.pos === '動'; });
      return true;
    });
  }

  en.lemmas = lemmas;
  en.analyze = analyze;
  en.lookup = lookup;
  en.morph = {
    clean: clean,
    hasPos: function (word, pos) {
      return analyze(word).some(function (a) { return a.entries.some(function (e) { return e.pos === pos; }); });
    },
    hasForm: hasForm,
    isBaseVerb: function (word) { return verbForm(word, 'base'); },
    isPast: function (word) { return verbForm(word, 'past'); },
    isPP: function (word) { return verbForm(word, 'pp'); },
    isIng: function (word) { return verbForm(word, 'ing'); },
    is3sg: function (word) { return verbForm(word, '3sg'); },
    isHeadword: function (word, pos) { return pos ? hasPos(clean(word), pos) : entriesOf(clean(word)).length > 0; },
    formName: function (form) { return FORM_NAME[form] || ''; }
  };
})(typeof window !== 'undefined' ? window : globalThis);
