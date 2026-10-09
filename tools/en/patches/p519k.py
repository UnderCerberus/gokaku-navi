import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# recall the first and last items better than those in the middle → 真ん中の品目（those in / for は直前の名詞。「名詞 of」を探すのは that of / those of だけ）
rep("""      for (let x = i - 2; x > 0; x--) { const ncX = T[x].k === 'w' && isW(T[x + 1], 'of') && !PRON[T[x].w] ? nounC(T[x]) : null; if (ncX && ncX.e) { pn3 = en.jp.first(ncX.e.ja); break; } }""",
    """      if (isW(T[i + 1], 'of') || !pn3) for (let x = i - 2; x > 0; x--) { const ncX = T[x].k === 'w' && isW(T[x + 1], 'of') && !PRON[T[x].w] ? nounC(T[x]) : null; if (ncX && ncX.e) { pn3 = en.jp.first(ncX.e.ja); break; } }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
