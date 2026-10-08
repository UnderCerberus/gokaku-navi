import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'for half an hour': '30分間', 'at any time': 'いつでも', """,
    """'for half an hour': '30分間', """)

rep("""    if (tokens.some((x) => x.w === 'anywhere') && tokens.some((x) => /^(?:can|could)$/.test(x.w || ''))) ja = ja.replace(/いつでもどこかで/g, 'いつでもどこでも').replace(/どこかで/g, 'どこでも');""",
    """    if (tokens.some((x) => x.w === 'anywhere') && tokens.some((x) => /^(?:can|could)$/.test(x.w || '')) && !tokens.some((x) => /^(?:not|never|cannot)$/.test(x.w || '') || /n't$/.test(x.w || ''))) ja = ja.replace(/どの時間にもどこかで/g, 'いつでもどこでも').replace(/どこかで/g, 'どこでも');""")

rep("""|| (!!adjC(t) && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && T.slice(i + 2, lim).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || (!!vc(x, ['3sg', 'past', 'base']) && !nounC(x))))))))) {""",
    """|| (!!adjC(t) && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && T.slice(i + 2, lim).some((x, q) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || (!!vc(x, ['3sg', 'past']) && !nounC(x)) || (!!vc(x, ['base']) && !nounC(x) && T[i + 1 + q] && T[i + 1 + q].k === 'w' && !!nounC(T[i + 1 + q]) && !isW(T[i + 1 + q], 'to'))))))))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
