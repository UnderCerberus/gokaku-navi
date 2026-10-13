import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He bought things that he needed, such as food, water, and clothes → 食べ物や水、服など、自分が必要とした物を買った
# （関係詞節のあとのコンマ + such as … は先行詞にかける。関係詞節の動詞につけて「自分が食べ物…などの必要とした」にしない）
rep("""    // 前置詞句
    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w] || (t.w === 'all' && isW(T[j + 1], 'through'))""",
    """    // 前置詞句
    if (seq(j, ['such', 'as']) && j > 0 && isP(T[j - 1], ',') && o && ((o.gap && o.gap.rel) || (o.sub && o.subj && o.subj.wh))) return -1;
    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w] || (t.w === 'all' && isW(T[j + 1], 'through'))""")

# 文末まで続く , such as A, B, or C（閉じるコンマがない）も名詞句にかける。関係詞節つきの名詞には「〜など、」で前に出す
rep("""        if (e2 > 0) {
          const ms = mark();
          const pps = parsePP(j + 1, e2, { noRel: o.noRel, ppObj: true });   // such as the one inside your smartphone（中の名詞句に前置詞句を許す）
          if (pps && pps.end === e2 && pps.obj) { node = Object.assign({}, node, { ja: pps.obj.ja + 'のような' + node.ja, end: e2 + 1 }); continue; }
          fail(ms);
        }""",
    """        if (e2 > 0) {
          const ms = mark();
          const pps = parsePP(j + 1, e2, { noRel: o.noRel, ppObj: true });   // such as the one inside your smartphone（中の名詞句に前置詞句を許す）
          if (pps && pps.end === e2 && pps.obj) { node = Object.assign({}, node, { ja: pps.obj.ja + 'のような' + node.ja, end: e2 + 1 }); continue; }
          fail(ms);
        }
        if (e2 < 0 && node.rel && (lim >= T.length || T[lim].k === 'p')) {
          const msE = mark();
          const ppsE = parsePP(j + 1, lim, { noRel: true, ppObj: true });
          if (ppsE && ppsE.end === lim && ppsE.obj && ppsE.obj.ja) { node = Object.assign({}, node, { ja: (ppsE.obj.itemsJa ? ppsE.obj.itemsJa.join('、') : ppsE.obj.ja) + 'など、' + node.ja, end: lim }); continue; }
          fail(msE);
        }""")

# 並列の名詞句に各要素の訳を残す（such as A, B, or C → A、B、Cなど）
rep("""    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head };""",
    """    return { ja: ja, end: j, an: items.every((x) => x.an), pl: true, coord: true,
      time: items.every((x) => x.time), head: first.head, itemsJa: then ? undefined : items.map((x) => x.ja) };""")

# such as a time of day, a place, or a particular feeling（冠詞つきの列挙のコンマ「, a place, or …」も飛ばす。「, a place」で同格を閉じて 2 つ目の目的語にしない）
rep("""          if (nx1 && nx1.k === 'w' && /^(?:and|or)$/.test(nx1.w)) continue;""",
    """          if (nx1 && nx1.k === 'w' && /^(?:and|or)$/.test(nx1.w)) continue;
          if (nx1 && nx1.k === 'w' && /^(?:a|an|the)$/.test(nx1.w) && T.slice(x + 2, Math.min(lim, x + 6)).some((y, q) => (isP(y, ',') || (y.k === 'w' && /^(?:and|or)$/.test(y.w))) && T.slice(x + 2, x + 2 + q).every((z) => z.k === 'w' && (!!nounC(z) || !!adjC(z)) && !vc(z, ['3sg', 'past'])))) continue;""")

# a time of day, a place, or a particular feeling / a cup of tea, a glass of milk（of + 冠詞のない 1 語 + コンマ + a / an の列挙は of の外側の並列）
rep("""          (isW(T[j + 1], 'the') && T.slice(j + 2, lim).some((x, q) => isW(x, 'and') && T[j + 3 + q] && /^(?:my|his|her|their|our|your)$/.test(T[j + 3 + q].w || ''))) ||   // the smell of the ocean and his kind smile""",
    """          (T[j + 1].k === 'w' && DET[T[j + 1].w] === undefined && !PRON[T[j + 1].w] && isP(T[j + 2], ',') && /^(?:a|an)$/.test((T[j + 3] || {}).w || '')) ||
          (isW(T[j + 1], 'the') && T.slice(j + 2, lim).some((x, q) => isW(x, 'and') && T[j + 3 + q] && /^(?:my|his|her|their|our|your)$/.test(T[j + 3 + q].w || ''))) ||   // the smell of the ocean and his kind smile""")

# something that triggers the behavior, such as …（関係詞節つきの something / anything にも同格の such as をかける）
rep("""      if (isP(t, ',') && !o.noApp && seq(j + 1, ['such', 'as']) && j + 3 < lim && !node.pron) {""",
    """      if (isP(t, ',') && !o.noApp && seq(j + 1, ['such', 'as']) && j + 3 < lim && (!node.pron || (node.rel && /^(?:something|anything|someone|anyone|somebody|anybody)$/.test(node.pron)))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
