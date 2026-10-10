import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I realized that my money, my student ID, and my train pass were all gone（並列で切った左側の末尾「A, B」のあとに「, and C」が続くなら列挙。B を A の同格にしない）
rep("""        const outerList = T.slice(j + 1, lim).some((x, q) => isP(x, ',') && (isW(T[j + 2 + q], 'and') || isW(T[j + 2 + q], 'or')));""",
    """        const outerList = T.slice(j + 1, lim).some((x, q) => isP(x, ',') && (isW(T[j + 2 + q], 'and') || isW(T[j + 2 + q], 'or'))) || (!!app && app.end >= lim && isP(T[lim], ',') && !!T[lim + 1] && /^(?:and|or)$/.test(T[lim + 1].w || ''));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
