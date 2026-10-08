import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Food is thrown away every year → 毎年捨てられている（受け身の句動詞のあとの時の表現）
rep("""        if (s0 < lim && !(T[s0].k === 'p' || (T[s0].k === 'w' && (PREP[T[s0].w] || SUB[T[s0].w] || ADV[T[s0].w] || /^(?:and|or|but)$/.test(T[s0].w))))) continue;
        if (!verbLike(it.ja)) continue;""",
    """        if (s0 < lim && !(T[s0].k === 'p' || (T[s0].k === 'w' && (PREP[T[s0].w] || SUB[T[s0].w] || ADV[T[s0].w] || /^(?:and|or|but|every|each|last|next|this|yesterday|today|tomorrow|tonight|once|twice|again)$/.test(T[s0].w))))) continue;
        if (!verbLike(it.ja)) continue;""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/(食べる|飲む)のに安全/g, (m0, a0) => (a0 === '食べる' ? '食べても' : '飲んでも') + '安全').replace(/(?:それら|彼ら|自分たち)が必要とするもの/g, '必要なもの');   // safe to eat → 食べても安全だ / buying only what they need → 必要なものだけを買う
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
