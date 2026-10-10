import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was a small thing → ささいなことだった（it / that + be + a + 形容詞 + thing は出来事 → こと）/ make your day better → あなたの一日（所有格 + day）
rep("""    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');""",
    """    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');
    if (nom.head === 'thing' && !nom.pl && /物$/.test(ja) && detW === 'a' && nom.n === 1 && nom.preJa && i >= 2 && T[i - 1].k === 'w' && BE[T[i - 1].w] && /^(?:it|that)$/.test(T[i - 2].w || '')) ja = ja.replace(/(?:小さい|小さな)物$/, 'ささいなこと').replace(/物$/, 'こと');
    if (nom.head === 'day' && !nom.pl && nom.ja === '日' && /^(?:my|your|his|her|our|their)$/.test(detW || '')) ja = ja.replace(/日$/, '一日');""")

# someone's day → 誰かの一日
rep("""        return postMod({ ja: pJ + nPs.ja, end: nPs.end, head: nPs.head, pl: nPs.pl, an: nPs.an, time: nPs.time, c: nPs.c, det: 'poss' }, lim, o);""",
    """        return postMod({ ja: pJ + (nPs.head === 'day' && nPs.ja === '日' ? '一日' : nPs.ja), end: nPs.end, head: nPs.head, pl: nPs.pl, an: nPs.an, time: nPs.time, c: nPs.c, det: 'poss' }, lim, o);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
