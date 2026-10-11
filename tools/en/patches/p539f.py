import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# especially an old brown one called Max → マックスと呼ばれる年老いた茶色のもの（修飾語 + 色の語 + one / ones は色も修飾語。「古い茶色に人が」にしない）
rep("""      if (nmod > 0 && T[j].k === 'w' && COLOR[T[j].w] && (j + 1 >= lim || T[j + 1].k !== 'w' || isW(T[j + 1], 'and') || isW(T[j + 1], 'or') || (!nounC(T[j + 1]) && !adjC(T[j + 1])))) break;""",
    """      if (nmod > 0 && T[j].k === 'w' && COLOR[T[j].w] && (j + 1 >= lim || T[j + 1].k !== 'w' || isW(T[j + 1], 'and') || isW(T[j + 1], 'or') || (!nounC(T[j + 1]) && !adjC(T[j + 1]))) && !isW(T[j + 1], 'one') && !isW(T[j + 1], 'ones')) break;""")

# I enjoyed spending time with the dogs, especially an old brown one called Max who … → 犬たち、特に…（, especially + 名詞句 の名詞句には分詞・関係詞節の後置修飾も許す）
rep("""        let nEs = np(j + 2, lim, { noRel: true, noCoord: o.noCoord });
        if (nEs && nEs.end < lim && T[nEs.end].k === 'w' && /^(?:who|that|which)$/.test(T[nEs.end].w)) {""",
    """        let nEs = np(j + 2, lim, { noRel: true, noCoord: o.noCoord });
        if (nEs && nEs.end < lim && T[nEs.end].k === 'w' && !/^(?:who|that|which)$/.test(T[nEs.end].w) && !!vc(T[nEs.end], ['pp', 'ing']) && !vc(T[nEs.end], ['past', '3sg', 'base'].filter((f) => f !== 'past' || !vc(T[nEs.end], ['pp'])))) { const mEs3 = mark(); const nEs3 = np(j + 2, lim, { noCoord: o.noCoord }); if (nEs3 && nEs3.end > nEs.end) nEs = nEs3; else fail(mEs3); }
        if (nEs && nEs.end < lim && T[nEs.end].k === 'w' && /^(?:who|that|which)$/.test(T[nEs.end].w)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
