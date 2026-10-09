import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Recycling alone cannot solve the problem → リサイクルだけでは問題を解決できない（主語 + alone + 否定）
rep("""    // a basic right rather than a special service（A rather than B → B というよりむしろ A）""",
    """    if (first.end < lim && isW(T[first.end], 'alone') && T[first.end + 1] && T[first.end + 1].k === 'w' && !first.pron && (/^(?:cannot|can't|won't)$/.test(T[first.end + 1].w) || ((MODAL[T[first.end + 1].w] || BE[T[first.end + 1].w] || DO[T[first.end + 1].w]) && /^(?:not|n't)$/.test((T[first.end + 2] || {}).w || '')))) {
      return Object.assign({}, first, { ja: first.ja + 'だけで', end: first.end + 1 });
    }
    // a basic right rather than a special service（A rather than B → B というよりむしろ A）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
