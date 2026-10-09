import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The test was the hardest I had ever taken → 試験は私が今までに受けた最も難しいものだった（最上級 + 主語の代名詞で始まる関係詞節は名詞句の補語で読む）
rep("""        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w])) { sup = true; k = k2; }""",
    """        if (!(k2 + 1 < lim && nounC(T[k2 + 1]) && !PREP[T[k2 + 1].w]) && !(k2 + 2 < lim && T[k2 + 1].k === 'w' && /^(?:i|you|we|he|she|they)$/.test(T[k2 + 1].w))) { sup = true; k = k2; }""")

# halfway: 「に」は住む・暮らすの所在だけ（stopped halfway up the mountain / fell asleep halfway through the movie は「で」）
rep("""        return { ja: wHw + (o.stative ? 'に' : 'で'), adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""",
    """        return { ja: wHw + (o.stative && /^(?:live|settle|be)$/.test(o.lemma || '') ? 'に' : 'で'), adn: wHw + 'の', kind: 'place', end: pHw.end, prep: 'halfway', obj: pHw.obj };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
