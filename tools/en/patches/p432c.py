import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Some employees report that … / report feeling … → employees report を複合名詞にしない
rep("""      // the students walk to school / students use the bus（複数名詞のあとの原形 + 限定詞・前置詞は動詞。複合名詞にしない）
""",
    """      if (cnt > 0 && pl && /^(?:report|say|claim|believe|argue|complain|worry|agree|admit|insist|suggest|feel|think|fear|hope|expect|predict|warn|explain|notice|realize)$/.test(t.w) && j + 1 < lim && T[j + 1].k === 'w' && (/^(?:that|feeling|being|having|it)$/.test(T[j + 1].w) || (PRON[T[j + 1].w] && PRON[T[j + 1].w].sub))) break;   // Some employees report that … / report feeling isolated
      // the students walk to school / students use the bus（複数名詞のあとの原形 + 限定詞・前置詞は動詞。複合名詞にしない）
""")

# Some employees report feeling isolated …, while others find … → …従業員もいれば、…従業員もいる
rep("""    if (isW(T[0], 'some') && T[1] && T[1].k === 'w' && !!vc(T[1], ['base'])) {
      const kOt = T.findIndex((x, q) => q > 2 && isW(x, 'others') && isP(T[q - 1], ','));""",
    """    if (isW(T[0], 'some') && T[1] && T[1].k === 'w' && !vc(T[1], ['base']) && !!nounC(T[1]) && !tokens.__someN) {
      const kOw = T.findIndex((x, q) => q > 3 && isW(x, 'others') && (isP(T[q - 1], ',') || (T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ','))));
      if (kOw > 0 && kOw + 1 < b) {
        const kEw = isP(T[kOw - 1], ',') ? kOw - 1 : kOw - 2;
        const hdW = T[1].s || T[1].w;
        const t1W = tokens.slice(0, kEw).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));
        const t2W = tokenize('Some ' + hdW + ' ' + T.slice(kOw + 1, b).map((x) => x.s || x.w).join(' ') + '.');
        t1W.__someN = true; t2W.__someN = true;
        const r1W = translate1(t1W), r2W = r1W && r1W.ok ? translate1(t2W) : null;
        reset(tokens);
        if (r1W && r1W.ok && r2W && r2W.ok && /もいる。$/.test(r1W.ja) && /もいる。$/.test(r2W.ja)) return { ok: true, ja: r1W.ja.replace(/もいる。$/, 'もいれば、') + r2W.ja, sp: '', names: ['correlative'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      }
    }
    if (isW(T[0], 'some') && T[1] && T[1].k === 'w' && !!vc(T[1], ['base'])) {
      const kOt = T.findIndex((x, q) => q > 2 && isW(x, 'others') && isP(T[q - 1], ','));""")

# report feeling isolated → 孤立していると感じていると報告する
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 4 && !tokens.__repF) {
      const kRf = T.findIndex((x, q) => q >= 1 && /^(?:report|reports|reported|admit|admits|admitted|recall|recalls|recalled)$/.test(x.w || '') && isW(T[q + 1], 'feeling') && T[q + 2] && T[q + 2].k === 'w' && (!!adjC(T[q + 2]) || !!vc(T[q + 2], ['pp'])));
      if (kRf > 0) {
        const pastRf = /ed$/.test(T[kRf].w);
        const tRf = tokens.slice(0, kRf + 1).concat([{ k: 'w', w: 'that', s: 'that' }, { k: 'w', w: 'they', s: 'they' }, Object.assign({}, tokens[kRf + 1], { w: pastRf ? 'felt' : 'feel', s: pastRf ? 'felt' : 'feel', raw: pastRf ? 'felt' : 'feel' })]).concat(tokens.slice(kRf + 2)).map((x, k) => Object.assign({}, x, { i: k }));
        tRf.__repF = true;
        const rRf = translate1(tRf);
        reset(tokens);
        if (rRf && rRf.ok) return rRf;
      }
    }
    // 呼びかけ: Ken, come here.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
