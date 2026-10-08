import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More and more elderly people … の more and more は名詞句の数量（形容詞 + 名詞が続くとき）
rep("""    if (fx && !svFixed && !fxCoord && !(fx.it && fx.it.phrase === 'more and more' && fx.end < lim && nounC(T[fx.end]))) {""",
    """    if (fx && !svFixed && !fxCoord && !(fx.it && fx.it.phrase === 'more and more' && fx.end < lim && (nounC(T[fx.end]) || (adjC(T[fx.end]) && fx.end + 1 < lim && T[fx.end + 1].k === 'w' && !!nounC(T[fx.end + 1]) && !PREP[T[fx.end + 1].w] && !vc(T[fx.end + 1], ['3sg', 'past']))))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
