import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I decided to talk about the tea ceremony, which my grandmother had taught me → …茶道について話すことに決めて、祖母は私にそれを教えてくれていた
# （非制限の目的格 which の主語が名詞句（my grandmother / the teacher / Ken）でも文を分けて読む）
rep("""        if (lf && !first && x + 3 < b && T[x + 2].k === 'w' && PRON[T[x + 2].w] && PRON[T[x + 2].w].sub) {""",
    """        if (lf && !first && x + 3 < b && T[x + 2].k === 'w' && ((PRON[T[x + 2].w] && PRON[T[x + 2].w].sub) || (/^(?:my|your|his|her|our|their|the)$/.test(T[x + 2].w) && T[x + 3].k === 'w' && !!nounC(T[x + 3])) || (T[x + 2].cap && !PRON[T[x + 2].w]))) {""")

rep("          const gapW = { type: 'np', node: { ja: 'それ', pron: 'it' }, used: false };\n          const clW = clause(x + 2, b, Object.assign({}, o, { gap: gapW, pastHint: !!lf.past }));",
    "          const gapW = { type: 'np', node: { ja: 'それ', pron: 'it', head: T[x - 1] && T[x - 1].k === 'w' && !!nounC(T[x - 1]) ? nounC(T[x - 1]).lemma : undefined }, used: false };   // 先行詞の名詞で語義を選ぶ（which his father had painted → 描いた）\n          const clW = clause(x + 2, b, Object.assign({}, o, { gap: gapW, pastHint: !!lf.past }));")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
