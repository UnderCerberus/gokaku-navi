import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# My heart sank when I realized that my money, my student ID, and my train pass were all gone（「A, B, and C」の列挙の「, and + 限定詞」は主節の区切りではない: 前にも「, + 限定詞」があれば列挙）
rep("""        if (isP(T[x], ',') && isW(T[x + 1], 'and') && T[x + 2] && T[x + 2].k === 'w' && (isW(T[x + 2], 'then') || isW(T[x + 2], 'there') || (PRON[T[x + 2].w] && PRON[T[x + 2].w].sub) || (DET[T[x + 2].w] !== undefined && !PRON[T[x + 2].w]))) return true;""",
    """        if (isP(T[x], ',') && isW(T[x + 1], 'and') && T[x + 2] && T[x + 2].k === 'w' && (isW(T[x + 2], 'then') || isW(T[x + 2], 'there') || (PRON[T[x + 2].w] && PRON[T[x + 2].w].sub) || (DET[T[x + 2].w] !== undefined && !PRON[T[x + 2].w] &&
          !T.slice(from, x).some((y, q) => isP(y, ',') && T[from + q + 1] && T[from + q + 1].k === 'w' && T[from + q + 1].w === T[x + 2].w && !T.slice(from + q + 2, x).some((z) => z.k === 'w' && (!!BE[z.w] || !!MODAL[z.w] || (!!vc(z, ['past', '3sg']) && !nounC(z)))))))) return true;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
