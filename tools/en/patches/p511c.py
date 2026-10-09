import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The key lies not in A but in B / Happiness comes not from money but from …（3 単現・過去 + not + 前置詞は動詞の始まり。名詞の lies（うそ）にしない）
rep("""  function verbStart(p) {
    const t = T[p];
    if (!t || t.k !== 'w') return false;""",
    """  function verbStart(p) {
    const t = T[p];
    if (!t || t.k !== 'w') return false;
    if (p > 0 && T[p - 1].k === 'w' && !!nounC(T[p - 1]) && DET[T[p - 1].w] === undefined && !!vc(t, ['3sg', 'past']) && isW(T[p + 1], 'not') && T[p + 2] && T[p + 2].k === 'w' && PREP[T[p + 2].w] && T.slice(p + 3).some((x) => isW(x, 'but'))) return true;""")

# As the population ages → 高齢化するにつれて（as + 変化の動詞）
rep("""        if (sc.pred && /^(?:温暖化する|""", """        if (sc.pred && /^(?:高齢化する|温暖化する|""")

# compared … with those of people who had never played an instrument（those of + 関係詞つきの名詞句）
rep("""        const inT = np1(i + 2, lim, Object.assign({}, o, { noRel: true }));
        if (inT) return { ja: inT.ja + 'の' + pn3, end: inT.end, head: inT.head, pl: t.w === 'those' };""",
    """        let inT = np1(i + 2, lim, Object.assign({}, o, { noRel: true }));
        if (inT && inT.end < lim && T[inT.end].k === 'w' && /^(?:who|that|which|whose)$/.test(T[inT.end].w)) { const mT2 = mark(); const inT2 = np(i + 2, lim, {}); if (inT2 && inT2.end > inT.end) inT = inT2; else fail(mT2); }
        if (inT) return { ja: inT.ja + 'の' + pn3, end: inT.end, head: inT.head, pl: t.w === 'those' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
