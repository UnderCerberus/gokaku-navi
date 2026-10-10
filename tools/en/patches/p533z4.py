import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I'll talk to the class / The teacher spoke to the class / tell the class → クラスのみんなに（話しかける相手の class は人の集まり。授業 にしない）
rep("""    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');""",
    """    if (nom.head === 'space' && /宇宙$/.test(ja) && !detW && i > 0 && T[i - 1].k === 'w' && /^(?:of|empty|open|extra|free|enough|much|more|little|storage|parking|living|office|work)$/.test(T[i - 1].w)) ja = ja.replace(/宇宙$/, '空間');
    if (nom.head === 'class' && !nom.pl && /授業$/.test(ja) && /^(?:the|our|my|your|his|her|their|whole)$/.test(detW || '') && i >= 2 && ((isW(T[i - 1], 'to') && /^(?:talk|talks|talked|talking|speak|speaks|spoke|speaking|explain|explains|explained|announce|announced|introduce|introduced|show|showed|say|said|read)$/.test(T[i - 2].w || '')) || (/^(?:tell|tells|told|telling|ask|asks|asked|teach|teaches|taught|thank|thanked)$/.test(T[i - 1].w || '')))) ja = ja.replace(/授業$/, 'クラスのみんな');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
