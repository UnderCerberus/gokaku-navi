import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# choose whichever they prefer → 好きなほうを選ぶ（whichever + 人 + prefer は 2 つから選ぶ「ほう」。「ほうを好むことは何でも」にしない）
rep("""      const gapW = { type: 'np', rel: true, used: false };
      const clW = clause(i + 1, lim, { gap: gapW, sub: true });""",
    """      const gapW = { type: 'np', rel: true, used: false };
      if (t.w === 'whichever' && i + 3 <= lim && T[i + 1].k === 'w' && PRON[T[i + 1].w] && PRON[T[i + 1].w].sub && T[i + 2] && /^(?:prefer|prefers|preferred)$/.test(T[i + 2].w || '') && i + 3 === lim) return { ja: '好きなほう', end: lim, bare: false, an: false, clause: true };
      const clW = clause(i + 1, lim, { gap: gapW, sub: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
