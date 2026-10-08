import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      if (!d2 && d1 && k2d < lim && T[k2d].k === 'w' && /^(?:how|why|where|when|whether)$/.test(T[k2d].w)) { const whD = whClause(k2d, lim); if (whD) d2 = { ja: whD.str, end: whD.end }; }   // but how you study""",
    """      if (!d2 && d1 && k2d < lim && T[k2d].k === 'w' && /^(?:how|why|where|when|whether|who)$/.test(T[k2d].w)) { const whD = whClause(k2d, lim); if (whD) d2 = { ja: whD.str.replace(/^(あなた|彼|彼女|私|人)が誰か$/, '$1がどんな人か'), end: whD.end }; }   // but how you study / but who you are → どんな人か""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
