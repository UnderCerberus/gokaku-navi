import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) few are willing … → 〜する人はほとんどいない（代名詞の few = few people）
rep("""    { const kGn = isW(t, 'a') ? i + 1 : i; if (seq(kGn, ['good', 'night'])""",
    """    if (t.w === 'few' && !(i > 0 && T[i - 1].k === 'w' && /^(?:a|very|so|too|quite|only|the)$/.test(T[i - 1].w)) && T[i + 1] && T[i + 1].k === 'w' && (BE[T[i + 1].w] || MODAL[T[i + 1].w] || HAVE[T[i + 1].w] || (!!vc(T[i + 1], ['base', 'past']) && !nounC(T[i + 1]))) && i + 1 <= lim) return { ja: 'ほとんどの人', end: i + 1, an: true, pl: true, head: 'people', fewNeg: true, det: 'few' };   // few are willing → 〜する人はほとんどいない
    { const kGn = isW(t, 'a') ? i + 1 : i; if (seq(kGn, ['good', 'night'])""")

# 2) cannot do either → どちらもできない（否定の文の目的語の either）
rep("""    if (n && n.pron === 'themselves' && /^(?:それら|彼ら)自身$/.test(n.ja || '')""",
    """    if (n && n.pron === 'either' && (st.neg || st.vgNeg)) return 'どちらも';   // cannot do either → どちらもできない
    if (n && n.pron === 'themselves' && /^(?:それら|彼ら)自身$/.test(n.ja || '')""")

# 3) learn that … → 〜ことを知る
rep("""    if (/^(?:find|realize|realise|notice|discover)$/.test(L)) return P('気づく', 'v5');""",
    """    if (/^(?:find|realize|realise|notice|discover)$/.test(L)) return P('気づく', 'v5');
    if (L === 'learn') return P('知る', 'v5');   // was disappointed to learn that … → 〜と知ってがっかりした""")

# 4) choose when and where they work → いつどこで働くか（疑問詞の並列）
rep("""    let gap = wh.type === 'np' ? { type: 'np', node: wh.node, used: false } : { type: wh.type, ja: wh.ja, where: !!wh.where, be: wh.be, isPred: wh.isPred, used: false };""",
    """    if (/^(?:when|where|how|why)$/.test(t.w) && (isW(T[j + 1], 'and') || isW(T[j + 1], 'or')) && T[j + 2] && /^(?:when|where|how|why)$/.test(T[j + 2].w || '') && j + 3 < lim) {
      const mWw = mark();
      const WJ = { when: 'いつ', where: 'どこで', how: 'どのように', why: 'なぜ' };
      const gW2 = { type: 'adv', ja: WJ[t.w] + (isW(T[j + 1], 'or') ? 'か' : '') + WJ[T[j + 2].w], used: false };
      const cW2 = clause(j + 3, lim, { gap: gW2, sub: true });
      if (cW2 && gW2.used) { name('indirect-q'); return { str: cW2.out({ part: 'が', form: 'attr' }).replace(/だろう$/, '') + 'か', end: lim }; }
      fail(mWw);
    }
    let gap = wh.type === 'np' ? { type: 'np', node: wh.node, used: false } : { type: wh.type, ja: wh.ja, where: !!wh.where, be: wh.be, isPred: wh.isPred, used: false };""")

# 5) even more pressure → さらに多くの圧力
rep("""    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""",
    """    if (isW(t, 'even') && (isW(T[i + 1], 'more') || isW(T[i + 1], 'less') || isW(T[i + 1], 'fewer')) && i + 2 < lim && T[i + 2].k === 'w' && !!nounC(T[i + 2])) {
      const mEv = mark();
      const nEv = np1(i + 1, lim, o);
      if (nEv) return Object.assign({}, nEv, { ja: 'さらに' + nEv.ja.replace(/^より/, '') });   // even more pressure → さらに多くの圧力
      fail(mEv);
    }
    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""")

# 6) VOBJ: get exercise / display information / recognize it / miss connections / put pressure
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'get|exercise|を|する', 'display|information data price prices calorie calories label labels warning warnings sign signs|を|表示する', 'put|pressure|を|かける',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
