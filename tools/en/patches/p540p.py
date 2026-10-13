import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He is not very tall → あまり背が高くない / She is not very interested in sports → スポーツにあまり興味がない / It is not so difficult → それほど難しくない
# （not very / not so + 形容詞は「あまり・それほど〜ない」。「とても背が高くない」にしない）
rep("""    (vg.advs || []).forEach((x) => { if (st.failNeg && x.w === 'never') return;""",
    """    (vg.advs || []).forEach((x) => { if (st.failNeg && x.w === 'never') return; if (vg.neg && /^(?:very|so)$/.test(x.w || '')) { addAdv(st, { ja: x.w === 'so' ? 'それほど' : 'あまり', kind: 'd', e: null }, x.w); return; }""")

rep("""        (adjC(T[k + 1]) || isW(T[k + 1], 'more') || isW(T[k + 1], 'less') || (ADV[T[k + 1].w] && ADV[T[k + 1].w][1] === 'd') || lyAdj(k + 1))) { deg += ADV[T[k].w][0]; k++; }""",
    """        (adjC(T[k + 1]) || isW(T[k + 1], 'more') || isW(T[k + 1], 'less') || (ADV[T[k + 1].w] && ADV[T[k + 1].w][1] === 'd') || lyAdj(k + 1))) { deg += vg.neg && T[k].w === 'very' && k > 0 && (isW(T[k - 1], 'not') || /n't$/.test(T[k - 1].w || '')) ? 'あまり' : ADV[T[k].w][0]; k++; }""")

rep("""    if (!t || t.k !== 'w' || k + 1 >= lim || (t.w === 'so' && (soThat || !adjC(T[k + 1]) || !(T[k - 1] && T[k - 1].k === 'w' && (BE[T[k - 1].w] ||""",
    """    const notSo = t && t.w === 'so' && k > 1 && (isW(T[k - 1], 'not') || /n't$/.test((T[k - 1] || {}).w || '')) && T[k - 2] && T[k - 2].k === 'w' && (!!BE[T[k - 2].w] || /^(?:is|are|was|were|isn't|aren't|wasn't|weren't)$/.test(T[k - 2].w) || /^(?:isn't|aren't|wasn't|weren't)$/.test(T[k - 1].w));
    if (notSo && !soThat && adjC(T[k + 1])) return 'それほど';   // It is not so difficult → それほど難しくない
    if (!t || t.k !== 'w' || k + 1 >= lim || (t.w === 'so' && (soThat || !adjC(T[k + 1]) || !(T[k - 1] && T[k - 1].k === 'w' && (BE[T[k - 1].w] ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
