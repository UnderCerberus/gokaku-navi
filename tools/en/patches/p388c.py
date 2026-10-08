import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (b >= 5 && T[0].k === 'w' && /^(?:hi|hello)$/.test(T[0].w) && isP(T[1], ',') && seq(2, ['this', 'is']) && T[4].k === 'w' && (T[4].cap || NAME_JA[T[4].w])) {""",
    """    if (b >= 5 && T[0].k === 'w' && /^(?:hi|hello)$/.test(T[0].w) && isP(T[1], ',') && seq(2, ['this', 'is']) && T[4].k === 'w' && (T[4].cap || NAME_JA[T[4].w]) && !isW(T[b - 1], 'speaking')) {""")
rep("""      if (rSo && rSo.ok) return Object.assign({}, rSo, { ja: rSo.ja.replace(/^それは/, '').replace(/。$/, 'ね。') });""",
    """      if (rSo && rSo.ok) return Object.assign({}, rSo, { ja: rSo.ja.replace(/^それは/, '').replace(/ね?。$/, 'ね。') });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
