import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they also point out that such changes take time and require cooperation between … → 変化には時間がかかり、…協力が必要だと指摘する
# （主語が人でも、that 節のあとの and + require / need / cost / cause … は that 節の中の並列。「指摘して、…協力を必要とする」にしない）
rep("""!o.sub && !!left.subj && !left.subj.an && !(left.subj.pron && /^(?:i|you|he|she|we|they)$/.test(left.subj.pron));   // 主節の主語が人なら（He said that … and went to bed）主節の並列のまま""",
    """!o.sub && !!left.subj && ((!left.subj.an && !(left.subj.pron && /^(?:i|you|he|she|we|they)$/.test(left.subj.pron))) || /^(?:require|requires|required|need|needs|cost|costs|cause|causes|caused|mean|means|meant|include|includes|involve|involves|depend|depends|lead|leads|reduce|reduces|increase|increases|affect|affects|remain|remains|contain|contains|produce|produces|prevent|prevents|allow|allows|harm|harms|damage|damages)$/.test(T[rs].w));   // 主節の主語が人なら（He said that … and went to bed）主節の並列のまま""")

# point out that / find out that も that 節をとる動詞（out の前の動詞を見る）
rep("""        const thatLeft = T.slice(a, je).some((x, q) => isW(x, 'that') && q > 0 && T[a + q - 1].k === 'w' && (() => { const vT = vc(T[a + q - 1], ['base', '3sg', 'past']);""",
    """        const thatLeft = T.slice(a, je).some((x, q) => isW(x, 'that') && q > 0 && T[a + q - 1].k === 'w' && (() => { if (T[a + q - 1].w === 'out' && q > 1 && /^(?:point|points|pointed|find|finds|found|figure|figures|figured)$/.test(T[a + q - 2].w || '')) return true; const vT = vc(T[a + q - 1], ['base', '3sg', 'past']);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
