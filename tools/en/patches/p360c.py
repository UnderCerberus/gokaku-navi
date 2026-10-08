import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      let d2 = d1 && k2d < lim ? (isW(T[k2d], 'what') ? whatClause(k2d, lim) : np(k2d, lim, { noRel: true })) : null;   // not what you have but what you are""",
    """      let d2 = null;
      if (d1 && k2d < lim && T[k2d].k === 'w' && /^(?:who|how|why|where|when|whether)$/.test(T[k2d].w)) { const whD0 = whClause(k2d, lim); if (whD0 && whD0.end === lim) d2 = { ja: whD0.str.replace(/^(あなた|彼|彼女|私|人)が誰か$/, '$1がどんな人か'), end: whD0.end }; }   // but who you are → どんな人か
      if (!d2) d2 = d1 && k2d < lim ? (isW(T[k2d], 'what') ? whatClause(k2d, lim) : np(k2d, lim, { noRel: true })) : null;   // not what you have but what you are""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
