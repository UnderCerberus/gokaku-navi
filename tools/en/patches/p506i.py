import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# was not the size of the fossil but the fact that it had been preserved …（B が同格の that 節・関係詞節を持つ名詞句）
rep("""      if (d1 && d2) { name('not-but'); vg.neg = false; return fin(P(d1.ja + 'ではなく' + d2.ja + 'だ', 'da'), tail(d2.end, lim, st, o, vg)); }
      fail(m7);""",
    """      if (d1 && d2 && d2.end < lim && !isW(T[k2d], 'what') && T[d2.end].k === 'w' && /^(?:that|which|who|whose|whom)$/.test(T[d2.end].w)) { const mD3 = mark(); const d3 = np(k2d, lim, {}); if (d3 && d3.end > d2.end) d2 = d3; else fail(mD3); }   // but the fact that …
      if (d1 && d2) { name('not-but'); vg.neg = false; return fin(P(d1.ja + 'ではなく' + d2.ja + 'だ', 'da'), tail(d2.end, lim, st, o, vg)); }
      fail(m7);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
