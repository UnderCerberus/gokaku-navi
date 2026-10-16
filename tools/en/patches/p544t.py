import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# take a train, a bus, and finally a ferry → 電車とバスと、最後にフェリーに乗る（名詞句の列挙の「and finally / lastly / eventually」は and then と同じに読む）
rep("""    let j = first.end, conj = '', then = false;""",
    """    let j = first.end, conj = '', then = false, thenJa = 'それから';""")
rep("""      if (c === 'and' && isW(T[k], 'then') && k + 1 < lim) { then = true; k++; }         // a few pages of one book and then a few pages of another（それから）""",
    """      if (c === 'and' && isW(T[k], 'then') && k + 1 < lim) { then = true; k++; }         // a few pages of one book and then a few pages of another（それから）
      if (c === 'and' && !then && T[k] && /^(?:finally|lastly|eventually)$/.test(T[k].w || '') && k + 1 < lim && T[k + 1].k === 'w' && (DET[T[k + 1].w] !== undefined || !!nounC(T[k + 1]) || !!adjC(T[k + 1]))) { then = true; thenJa = T[k].w === 'eventually' ? '最終的に' : '最後に'; k++; }""")
rep("""    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、それから' + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');""",
    """    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、' + thenJa + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
