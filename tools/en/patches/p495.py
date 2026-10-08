import io
ROOT = r'C:\Claude\gokaku-navi' + '\\'

def patch(rel, pairs):
    p = ROOT + rel
    s = io.open(p, encoding='utf-8').read()
    for old, new in pairs:
        n = s.count(old)
        assert n == 1, (rel, n, old[:80])
        s = s.replace(old, new)
    io.open(p, 'w', encoding='utf-8', newline='\n').write(s)

# 似た内蔵文（fuzzy）の訳がエンジンの訳を上書きしていた件:
# 知っている語が違う文はエンジンの訳を出し、似た内蔵文は参考（ref）に回す。
# 内蔵文の訳をそのまま使うのは、構文解析できない文と、つづりの誤りだけの文に限る。
patch('js/english/translator.js', [
    ("""   JK.en.translate(text) → { sentences:[{ en, ja, method, score, source, gloss, grammar }], vocab, idioms }
     method: exact（内蔵長文と完全一致）/ fuzzy（似た文）/ pattern（構文解析して組み立てた訳）/ gloss（句ごとの直訳）""",
     """   JK.en.translate(text) → { sentences:[{ en, ja, method, score, source, ref, gloss, grammar }], vocab, idioms }
     method: exact（内蔵長文と完全一致）/ fuzzy（似た文。構文解析できない文と、つづりの誤りだけの文）/ pattern（構文解析して組み立てた訳）/ gloss（句ごとの直訳）
     ref: 似た内蔵文があるのにエンジンの訳を出したときの参考 { en, ja, title, score }（なければ null）"""),
    ("""  /* ================= 辞書引き・語注 ================= */""",
     """  // 食い違う語が、入力側ではすべてエンジンの知らない語で、内蔵文側の語のつづり違い（編集距離 2 以内）か。
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

  /* ================= 辞書引き・語注 ================= */"""),
    ("""    const hit = k ? mem.exact[k] : null;
    if (hit) { ja = hit.ja; method = 'exact'; score = 1; source = hit.title; }
    else {
      const fz = k ? fuzzy(k, mem) : null;
      if (fz) { ja = fz.it.ja; method = 'fuzzy'; score = Math.round(fz.score * 100) / 100; source = fz.it.title + '（内蔵の文: ' + fz.it.en + '）'; }
    }
    if (hasSyn && toks.length && toks.length <= MAX_TOKENS) {
      try { syn = en.syn.translate(toks); } catch (e) { syn = null; }
    }
    if (syn && syn.ok) { sel = syn.sel || {}; usedIdioms = syn.idioms || []; }
""",
     """    const hit = k ? mem.exact[k] : null;
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
"""),
    ("""      sentence: { en: s, ja: ja, method: method, score: score, source: source,
""",
     """      sentence: { en: s, ja: ja, method: method, score: score, source: source, ref: ref,
"""),
])

patch('js/english/ui.js', [
    ("""        source: srcText(s.source),
        gloss: arr(s.gloss).filter(Boolean), grammar: arr(s.grammar).filter(Boolean)""",
     """        source: srcText(s.source),
        ref: s.ref && typeof s.ref === 'object' && str(s.ref.ja).trim() ? {
          en: str(s.ref.en), ja: str(s.ref.ja), title: srcText(s.ref.title),
          score: typeof s.ref.score === 'number' && isFinite(s.ref.score) ? s.ref.score : null
        } : null,
        gloss: arr(s.gloss).filter(Boolean), grammar: arr(s.grammar).filter(Boolean)"""),
    ("""    if (hasJa && METHOD_NOTE[s.method]) h += '<div class="en-gl-note small dim">' + esc(METHOD_NOTE[s.method]) + '</div>';
""",
     """    if (hasJa && METHOD_NOTE[s.method]) h += '<div class="en-gl-note small dim">' + esc(METHOD_NOTE[s.method]) + '</div>';
    // 似た内蔵文があっても語が違う文は、エンジンの訳を出し、内蔵文の対訳を参考として見せる
    if (s.ref) {
      h += '<div class="en-gl-note small dim">参考: 内蔵の長文に似た文があります（' + (s.ref.title ? esc(s.ref.title) + '・' : '') +
        (s.ref.score != null ? '一致率 ' + pct(s.ref.score) + '%' : '') + '）。上の訳は、入力した文を解析して作ったものです。<br>' +
        esc(s.ref.en) + '<br>' + esc(s.ref.ja) + '</div>';
    }
"""),
])

patch('tools/en/t-tr.js', [
    ("""  const changed = words.slice(); changed[k] = 'remarkable';
  r = en.translate(changed.join(' '));
  ok(r.sentences[0].method === 'fuzzy' && r.sentences[0].score >= 0.8 && r.sentences[0].score < 1, 'TM 1 語違い fuzzy: ' + r.sentences[0].method + ' ' + r.sentences[0].score);
  console.log('  fuzzy 例:', changed.join(' ').slice(0, 90), '→', r.sentences[0].method, r.sentences[0].score, '|', String(r.sentences[0].source).slice(0, 80));
""",
     """  // 知っている語が違う文は、エンジンの訳を出し、似た内蔵文は参考（ref）に添える（解析できない文だけ内蔵文の訳 = fuzzy）
  const changed = words.slice(); changed[k] = 'remarkable';
  r = en.translate(changed.join(' '));
  const synOk = (x) => { try { const t = en.syn.translate(en.syn.tokenize(x)); return !!(t && t.ok); } catch (e) { return false; } };
  const r1 = r.sentences[0];
  if (synOk(changed.join(' '))) ok(r1.method !== 'fuzzy' && r1.ja !== long.ja && r1.ref && r1.ref.ja === long.ja && r1.ref.score >= 0.8 && r1.ref.score < 1, 'TM 1 語違いはエンジンの訳＋参考: ' + r1.method + ' ' + JSON.stringify(r1.ref || null).slice(0, 80));
  else ok(r1.method === 'fuzzy' && r1.score >= 0.8 && r1.score < 1, 'TM 1 語違い（解析できない文）は fuzzy: ' + r1.method + ' ' + r1.score);
  console.log('  1 語違いの例:', changed.join(' ').slice(0, 90), '→', r1.method, '|', String(r1.ja).slice(0, 60));
  // つづりの誤りだけの文は、内蔵文の訳（fuzzy）
  const swap = (w) => { for (let i = 1; i + 1 < w.length; i++) if (w[i] !== w[i + 1]) return w.slice(0, i) + w[i + 1] + w[i] + w.slice(i + 2); return w + 'x'; };
  const typo = words.slice(); typo[k] = swap(words[k]);
  r = en.translate(typo.join(' '));
  ok(r.sentences[0].method === 'fuzzy' && r.sentences[0].ja === long.ja && !r.sentences[0].ref, 'TM つづり誤りは fuzzy: ' + typo[k] + ' ' + r.sentences[0].method);
"""),
])

patch('README.md', [
    ("""| 類似文 | 語の並びが 8 割以上一致する内蔵文の訳を表示（否定語・数が食い違う文は採らない）。もとの文を「出典」に併記 | 違う語は語注で確認 |""",
     """| 類似文 | 語の並びが 8 割以上一致する内蔵文の訳を表示（否定語・数が食い違う文は採らない）。もとの文を「出典」に併記。使うのは構文解析できない文と、違う語がつづりの誤りだけの文に限る。辞書にある語が違う文は「構文パターン」で訳し、似た内蔵文の対訳は語注の欄に参考として出す | 違う語は語注で確認 |"""),
])

patch('docs/CONTRACT.md', [
    ("""JK.en.translate(text)         // → { sentences:[{en, ja, method:'exact'|'fuzzy'|'pattern'|'gloss', score, source, gloss:[{w,lemma,pos,ja}], grammar:[{name,explain}]}], vocab:[{w,pos,ja,lv}], idioms:[{phrase,ja,lv}] }""",
     """JK.en.translate(text)         // → { sentences:[{en, ja, method:'exact'|'fuzzy'|'pattern'|'gloss', score, source, ref:{en,ja,title,score}|null, gloss:[{w,lemma,pos,ja}], grammar:[{name,explain}]}], vocab:[{w,pos,ja,lv}], idioms:[{phrase,ja,lv}] }
                              //   ref = 似た内蔵文があるのに、語が違うためエンジンの訳を出したときの参考（fuzzy は構文解析できない文・つづり誤りだけの文に限る）"""),
])
print('ok')
