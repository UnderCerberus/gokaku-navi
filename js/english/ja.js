/* GOKAKU NAVI — 英語エンジン: 日本語の語形づくり（和訳の組み立て用）
   JK.en.jp.P(text)            述語（辞書形の文字列）→ 活用できるオブジェクト
   JK.en.jp.senses(gloss)      辞書の語義 '〜を壊す; 壊れる' → [{ particle:'を', core:'壊す' }, { particle:'', core:'壊れる' }]
   JK.en.jp.adj(gloss)         形容詞の語義 → { attr, pred(述語 P), adv, te, stem, kind }
   読み込み時には DOM にも辞書にも触らない。 */
(function (g) {
  'use strict';
  var JK = g.JK;
  var en = JK.en = JK.en || {};

  /* ================= 動詞の活用 ================= */

  // 五段活用: 語尾 → [過去, て形, 未然(ない の前), 連用, 仮定(ば の前), 意志]
  var GODAN = {
    'う': ['った', 'って', 'わ', 'い', 'え', 'おう'],
    'く': ['いた', 'いて', 'か', 'き', 'け', 'こう'],
    'ぐ': ['いだ', 'いで', 'が', 'ぎ', 'げ', 'ごう'],
    'す': ['した', 'して', 'さ', 'し', 'せ', 'そう'],
    'つ': ['った', 'って', 'た', 'ち', 'て', 'とう'],
    'ぬ': ['んだ', 'んで', 'な', 'に', 'ね', 'のう'],
    'ぶ': ['んだ', 'んで', 'ば', 'び', 'べ', 'ぼう'],
    'む': ['んだ', 'んで', 'ま', 'み', 'め', 'もう'],
    'る': ['った', 'って', 'ら', 'り', 'れ', 'ろう']
  };
  var ICHIDAN_KANJI = '見着寝出得経煮似射居診観看視';          // 漢字 + る で一段活用になる漢字
  var GODAN_KANA_RU = /(?:しゃべ|さえぎ|混じ|交じ|まじ|かじ|いじ|ねじ|なじ|よじ|ちぎ|みなぎ|うね|ひね|つね|しげ|かげ|すべ|にぎ|かぎ|はし|はい|かえ)る$/;
  var ICHIDAN_ROW = 'いきぎしじちぢにひびぴみりえけげせぜてでねへべぺめれ';
  var SA_SURU = '愛訳略害介課託';                                 // 「愛する → 愛さない」型

  function isKanji(ch) { return /[一-鿿々]/.test(ch); }

  // 述語（辞書形）の活用の種類を決める
  function classify(s) {
    if (/(?:でき|出来)る$/.test(s)) return 'v1';
    if (/(?:^|[^ぁ-ん])(?:こする|かする|擦る)$/.test(s) || s === 'こする') return 'v5';   // こする・かする は五段（こすられる）
    if (/する$/.test(s)) return 'suru';
    if (/来る$/.test(s) || /[てで]くる$/.test(s) || s === 'くる') return 'kuru';
    if (/(?:で|が|に|も|は|と)ある$/.test(s) || s === 'ある') return 'aru';
    if (/だ$/.test(s)) return 'da';
    if (/い$/.test(s)) return 'i';
    if (/[うくぐすつぬぶむ]$/.test(s)) return 'v5';
    if (/る$/.test(s)) {
      var p = s.charAt(s.length - 2);
      if (isKanji(p)) return ICHIDAN_KANJI.indexOf(p) >= 0 ? 'v1' : 'v5';
      if (ICHIDAN_ROW.indexOf(p) >= 0) return GODAN_KANA_RU.test(s) ? 'v5' : 'v1';
      return 'v5';
    }
    return 'n';                     // 名詞・その他（だ を補って活用する）
  }

  /* 述語オブジェクト。s = 辞書形の文字列、cls = 活用の種類
     cls: v5 五段 / v1 一段 / suru / kuru / aru / i 形容詞型 / da 断定 / n 名詞 / fix 活用しない */
  function P(s, cls) {
    if (!(this instanceof P)) return new P(s, cls);
    this.s = String(s);
    this.cls = cls || classify(this.s);
    if (this.cls === 'n') { this.s += 'だ'; this.cls = 'da'; }
  }
  function head(p, n) { return p.s.slice(0, p.s.length - n); }
  function kuruStem(p, row) {       // 来る / くる の語幹
    var kanji = /来る$/.test(p.s);
    return head(p, 2) + (kanji ? '来' : row);
  }
  function suruNeg(p) {
    var st = head(p, 2), last = st.charAt(st.length - 1);
    return st.length >= 1 && SA_SURU.indexOf(last) >= 0 && (st.length === 1 || !isKanji(st.charAt(st.length - 2))) ? st + 'さ' : st + 'し';
  }

  // 形: dict 辞書形 / past 過去 / te て形 / neg 否定 / negpast 否定過去 / stem 連用形（ます の前）/ ba 仮定（〜ば）/ tara 〜たら
  //     vol 意志（〜よう）/ pass 受け身の辞書形 / caus 使役の辞書形 / nai 未然形（ない を除いた形）
  P.prototype.form = function (f) {
    var p = this, s = p.s, c = p.cls, t, g5;
    if (f === 'dict') return s;
    if (f === 'neg' && /知っている$/.test(s)) return s.replace(/知っている$/, '知らない');     // 知っている の否定は 知らない
    if (f === 'tara') return p.form('past') + 'ら';
    if (f === 'negpast') return p.form('neg').replace(/い$/, 'かった');
    if (c === 'fix') return s;
    if (c === 'v5') {
      t = s.charAt(s.length - 1);
      g5 = GODAN[t];
      var st = head(p, 1);
      if (/(?:行|い)く$/.test(s) && (f === 'past' || f === 'te')) return st + (f === 'past' ? 'った' : 'って');   // 行く → 行った
      if (/(?:問|乞|請)う$/.test(s) && (f === 'past' || f === 'te')) return st + (f === 'past' ? 'うた' : 'うて');
      switch (f) {
        case 'past': return st + g5[0];
        case 'te': return st + g5[1];
        case 'nai': return st + g5[2];
        case 'neg': return st + g5[2] + 'ない';
        case 'stem': return st + g5[3];
        case 'ba': return st + g5[4] + 'ば';
        case 'vol': return st + g5[5];
        case 'pass': return st + g5[2] + 'れる';
        case 'caus': return st + g5[2] + 'せる';
      }
    }
    if (c === 'v1') {
      t = head(p, 1);
      switch (f) {
        case 'past': return t + 'た';
        case 'te': return t + 'て';
        case 'nai': return t;
        case 'neg': return t + 'ない';
        case 'stem': return t;
        case 'ba': return t + 'れば';
        case 'vol': return t + 'よう';
        case 'pass': return t + 'られる';
        case 'caus': return t + 'させる';
      }
    }
    if (c === 'suru') {
      t = head(p, 2);
      switch (f) {
        case 'past': return t + 'した';
        case 'te': return t + 'して';
        case 'nai': return suruNeg(p);
        case 'neg': return suruNeg(p) + 'ない';
        case 'stem': return t + 'し';
        case 'ba': return t + 'すれば';
        case 'vol': return t + 'しよう';
        case 'pass': return t + 'される';
        case 'caus': return t + 'させる';
      }
    }
    if (c === 'kuru') {
      switch (f) {
        case 'past': return kuruStem(p, 'き') + 'た';
        case 'te': return kuruStem(p, 'き') + 'て';
        case 'nai': return kuruStem(p, 'こ');
        case 'neg': return kuruStem(p, 'こ') + 'ない';
        case 'stem': return kuruStem(p, 'き');
        case 'ba': return kuruStem(p, 'く') + 'れば';
        case 'vol': return kuruStem(p, 'こ') + 'よう';
        case 'pass': return kuruStem(p, 'こ') + 'られる';
        case 'caus': return kuruStem(p, 'こ') + 'させる';
      }
    }
    if (c === 'aru') {
      t = head(p, 2);
      var de = /で$/.test(t);       // である
      switch (f) {
        case 'past': return t + 'あった';
        case 'te': return t + 'あって';
        case 'nai': return t + 'あら';
        case 'neg': return de ? t + 'はない' : t + 'ない';
        case 'stem': return t + 'あり';
        case 'ba': return t + 'あれば';
        case 'vol': return t + 'あろう';
        case 'pass': return s;
        case 'caus': return s;
      }
    }
    if (c === 'i') {
      t = /(?:^|[^あ-ん])いい$/.test(s) || s === 'いい' ? head(p, 2) + 'よ' : head(p, 1);     // いい → よ
      switch (f) {
        case 'past': return t + 'かった';
        case 'te': return t + 'くて';
        case 'nai': return t + 'く';
        case 'neg': return t + 'くない';
        case 'stem': return t;
        case 'ba': return t + 'ければ';
        case 'vol': return s + 'だろう';
        case 'adv': return t + 'く';
        case 'pass': return s;
        case 'caus': return s;
      }
    }
    if (c === 'da') {
      t = head(p, 1);
      switch (f) {
        case 'past': return t + 'だった';
        case 'te': return t + 'で';
        case 'nai': return t + 'では';
        case 'neg': return t + 'ではない';
        case 'stem': return t + 'であり';
        case 'ba': return t + 'なら';
        case 'vol': return t + 'だろう';
        case 'bare': return t;                 // だ を除いた形（〜かもしれない などの前）
        case 'attr': return NA_ADJ.test(t) ? t + 'な' : t + 'である';       // 連体形（名詞の前）: 形容動詞は な（私が好きな食べ物）、名詞は である
        case 'pass': return s;
        case 'caus': return s;
      }
    }
    return s;
  };

  // 補助的な表現をつないだ新しい述語を返す
  P.prototype.aux = function (kind) {
    var p = this, c = p.cls;
    switch (kind) {
      case 'prog': return c === 'i' || c === 'da' || c === 'fix' ? p : new P(p.form('te') + 'いる', 'v1');          // 〜ている
      case 'pass': return c === 'i' || c === 'da' || c === 'aru' || c === 'fix' ? p : new P(p.form('pass'), 'v1'); // 〜される
      case 'caus': return c === 'i' || c === 'da' || c === 'aru' || c === 'fix' ? p : new P(p.form('caus'), 'v1'); // 〜させる
      case 'neg': return new P(p.form('neg'), 'i');                                                              // 〜ない
      case 'can':                                                                                                // 可能形: 泳げる・旅行できる・食べられる（作れない形は 〜ことができる）
        if (c === 'suru' && /をする$/.test(p.s)) return new P(p.s.replace(/をする$/, 'ができる'), 'v1');            // テニスをする → テニスができる
        if (c === 'suru' && /する$/.test(p.s) && !/(?:ことを|ように|ことに)する$/.test(p.s)) return new P(p.s.replace(/する$/, 'できる'), 'v1');   // 旅行する → 旅行できる
        if (c === 'v5' && GODAN[p.s.charAt(p.s.length - 1)] && !/(?:ある|分かる|わかる|要る|知る|ござる|役立つ|役に立つ)$/.test(p.s)) return new P(head(p, 1) + GODAN[p.s.charAt(p.s.length - 1)][4] + 'る', 'v1');   // 泳ぐ → 泳げる
        if (c === 'v1' && (!/(?:^いる|[^てで]いる|ている|でいる|できる|える|こえる|られる|れる)$/.test(p.s) || /(?:終える|考える|教える|答える|覚える|変える|伝える|加える|与える|抑える|支える|捕まえる|迎える|数える|植える|揃える|そろえる|整える|訴える|鍛える|蓄える|備える|控える|抱える|押さえる|着替える|替える|換える|乗り越える|超える|越える|耐える|唱える|添える|かなえる|叶える|とらえる|捉える|捕らえる|こらえる|堪える|据える|構える|鍛える)$/.test(p.s))) return new P(head(p, 1) + 'られる', 'v1');   // 食べる → 食べられる・終える → 終えられる
        if (c === 'kuru') return new P(kuruStem(p, 'こ') + 'られる', 'v1');                                       // 来る → 来られる
        return new P(p.plain() + 'ことができる', 'v1');
      case 'want': return c === 'i' || c === 'da' || c === 'fix' ? p : new P(p.form('stem') + 'たい', 'i');
      case 'must':                                                                                               // 〜なければならない
        if (c === 'da') return new P(p.form('bare') + 'でなければならない', 'i');
        if (/である$/.test(p.s)) return new P(p.s.replace(/である$/, 'でなければならない'), 'i');            // 親切である → 親切でなければならない
        return new P(p.form('neg').replace(/い$/, 'ければならない'), 'i');
      case 'mustnot': return new P(p.form('te') + 'はいけない', 'i');
      case 'should': return new P(p.plain() + 'べきだ', 'da');
      case 'may': return new P(p.bare() + 'かもしれない', 'i');
      case 'sure': return new P(p.bare() + 'に違いない', 'i');
      case 'will': return new P(p.bare() + 'だろう', 'fix');
      case 'intend': return new P(p.plain() + 'つもりだ', 'da');
      case 'exp': return new P(p.form('past') + 'ことがある', 'aru');                                             // 経験
      case 'justdone': return new P(p.form('past') + 'ところだ', 'da');
      case 'needless': return new P(p.plain() + '必要はない', 'i');
      case 'better': return new P(p.form('past') + 'ほうがよい', 'i');
      case 'usedto': return new P(p.form('past') + 'ものだ', 'da');
      case 'keep': return c === 'i' || c === 'da' || c === 'fix' ? p : new P(p.form('stem') + '続ける', 'v1');
      case 'begin': return c === 'i' || c === 'da' || c === 'fix' ? p : new P(p.form('stem') + '始める', 'v1');
    }
    return p;
  };
  // 連体形を「な」にする形容動詞（名詞と区別できないので代表的な語と「〜的」だけ）
  var NA_ADJ = /(?:好き|嫌い|大好き|大嫌い|得意|苦手|必要|大切|重要|簡単|大変|有名|静か|きれい|便利|不便|元気|自由|親切|丁寧|安全|危険|健康|幸せ|不幸|残念|特別|普通|自然|複雑|単純|明らか|確か|正確|可能|不可能|十分|豊か|新鮮|素敵|上手|下手|暇|真剣|深刻|重大|公平|平和|正直|誠実|熱心|不思議|不安|心配|退屈|無理|無駄|大丈夫|貴重|快適|立派|有名|適切|必死|健全|勤勉|優秀|親密|奇妙|確実|新た|様々|さまざま|色々|いろいろ|主要|有効|有益|有害|有利|不利|的)$/;
  // 名詞・「こと」などの前に置く形（連体形）。だ → である（形容動詞は な）
  P.prototype.plain = function () { return this.cls === 'da' ? this.form('attr') : this.s; };
  // 「かもしれない」「だろう」の前に置く形。だ を落とす
  P.prototype.bare = function () { return this.cls === 'da' ? this.form('bare') : this.s; };

  // 文末の形。o = { past, neg, polite, q }
  P.prototype.end = function (o) {
    o = o || {};
    var p = o.neg ? this.aux('neg') : this, c = p.cls;
    if (!o.polite) {
      if (c === 'aru' && /である$/.test(p.s)) return p.s.slice(0, -3) + (o.past ? 'だった' : 'だ');   // 客でいっぱいである → いっぱいだった（文末は だ 体）
      return o.past ? p.form('past') : p.s;
    }
    // ていねいな形（疑問文などで使う）
    var out;
    if (c === 'aru' && /である$/.test(p.s)) {
      out = p.s.slice(0, -3) + (o.past ? 'でした' : 'です');          // である → です
    } else if (c === 'v5' || c === 'v1' || c === 'suru' || c === 'kuru' || c === 'aru') {
      out = p.form('stem') + (o.past ? 'ました' : 'ます');
    } else if (c === 'i') {
      if (/ない$/.test(p.s) && this !== p) {
        // 動詞の否定: 〜ない → 〜ません
        var b = this.cls;
        if (b === 'v5' || b === 'v1' || b === 'suru' || b === 'kuru') out = this.form('stem') + (o.past ? 'ませんでした' : 'ません');
        else if (b === 'aru') out = this.form('stem').replace(/あり$/, '') + (/で$/.test(head(this, 2)) ? 'はありません' : 'ありません') + (o.past ? 'でした' : '');
        else if (b === 'da') out = this.form('bare') + (o.past ? 'ではありませんでした' : 'ではありません');
        else out = (o.past ? p.form('past') : p.s) + 'です';
      } else if (/ならない$/.test(p.s)) {
        out = p.s.replace(/ならない$/, o.past ? 'なりませんでした' : 'なりません');   // なければならない → なければなりません
      } else if (/(?:いけ|しれ)ない$/.test(p.s)) {
        out = p.s.replace(/ない$/, o.past ? 'ませんでした' : 'ません');
      } else if (/に違いない$/.test(p.s)) {
        out = p.s.replace(/ない$/, o.past ? 'ありませんでした' : 'ありません');
      } else out = (o.past ? p.form('past') : p.s) + 'です';
    } else if (c === 'da') {
      out = p.form('bare') + (o.past ? 'でした' : 'です');
    } else {
      out = p.s.replace(/だろう$/, 'でしょう');
    }
    return out;
  };

  /* ================= 辞書の語義の読み取り ================= */

  function stripNotes(s) {
    return String(s).replace(/[(（][^()（）]*[)）]/g, '').trim();
  }
  // 動詞の語義 → [{ particle, core, raw }]。'〜を壊す' → を + 壊す。'〜' が途中にある語義（'〜を…と呼ぶ'）は frame: true
  function senses(gloss) {
    return String(gloss || '').split(/[;；]/).map(function (x) {
      var raw = stripNotes(x), m = /^〜(を|に|が|と|へ|から|で|について|のために|より)?(.*)$/.exec(raw);
      if (!raw) return null;
      if (m) return { particle: m[1] || '', core: m[2], raw: raw, tr: true, frame: /[〜…]|[A-D]/.test(m[2]) };
      return { particle: '', core: raw, raw: raw, tr: false, frame: /[〜…]/.test(raw) };
    }).filter(Boolean);
  }
  // 名詞・副詞などの語義の第 1 義
  function first(gloss) {
    var s = stripNotes(String(gloss || '').split(/[;；]/)[0]);
    return s.replace(/^〜/, '');
  }

  // 形容詞の語義 → 連体形 attr / 述語 pred(P) / 副詞形 adv / て形 te / 語幹 stem（〜すぎる の前）
  function adj(gloss) {
    var list = String(gloss || '').split(/[;；]/).map(stripNotes).filter(Boolean);
    var a = list[0] || '';
    for (var i = 0; i < list.length; i++) { if (list[i].indexOf('〜') < 0) { a = list[i]; break; } }
    a = a.replace(/^〜/, '');
    var kind, pred, adv, te, stem;
    if (/い$/.test(a) && !/(?:きれい|嫌い|きらい|幸い|みたい)$/.test(a)) {
      kind = 'i'; pred = new P(a, 'i'); adv = pred.form('adv'); te = pred.form('te'); stem = pred.form('stem');
    } else if (/な$/.test(a)) {
      kind = 'na'; stem = a.slice(0, -1); pred = new P(stem + 'だ', 'da'); adv = stem + 'に'; te = stem + 'で';
    } else if (/の$/.test(a)) {
      kind = 'no'; stem = a.slice(0, -1); pred = new P(stem + 'だ', 'da'); adv = stem + 'で'; te = stem + 'で';
    } else if (/[ただ]$/.test(a) && a.length > 1) {
      kind = 'ta';                                   // 疲れた → 疲れている / 混んだ → 混んでいる
      pred = new P(a.replace(/た$/, 'ている').replace(/だ$/, 'でいる'), 'v1');
      adv = a.replace(/た$/, 'て').replace(/だ$/, 'で'); te = pred.form('te'); stem = null;
    } else if (/[てで]$/.test(a)) {
      kind = 'te'; pred = new P(a + 'いる', 'v1'); adv = a; te = pred.form('te'); stem = null;
    } else if (/.のある$/.test(a)) {                 // 人気のある → 人気がある（述語）/ 価値のある → 価値がある
      kind = 'v'; pred = new P(a.replace(/のある$/, 'がある')); adv = pred.form('te'); te = pred.form('te'); stem = null;
    } else if (/る$/.test(a) || /[をにがと].*[うくぐすつぬぶむ]$/.test(a)) {      // 役に立つ・間に合う のような動詞句の形容詞
      kind = 'v'; pred = new P(a); adv = pred.form('te'); te = pred.form('te'); stem = null;
    } else if (/べき$/.test(a)) {
      kind = 'beki'; pred = new P(a + 'だ', 'da'); adv = a; te = a + 'で'; stem = null;
    } else {
      kind = 'n'; stem = a; pred = new P(a + 'だ', 'da'); adv = a + 'で'; te = a + 'で';
    }
    var attr = kind === 'te' ? a + 'いる' : (kind === 'n' ? (/[じ]$/.test(a) ? a : a + 'の') : a);
    return { attr: attr, pred: pred, adv: adv, te: te, stem: stem, kind: kind, raw: a };
  }

  en.jp = { P: P, classify: classify, senses: senses, first: first, adj: adj, stripNotes: stripNotes, NA_ADJ: NA_ADJ };
})(typeof window !== 'undefined' ? window : globalThis);
