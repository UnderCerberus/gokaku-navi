import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Athletes are less likely to suffer injuries and tend to perform better（and + tend / seem / appear + to は述語の並列。不定詞の中の並列にしない）
rep("""      if (isCC && (w === 'and' || w === 'or') && je === j && rs === j + 1 && T[rs].k === 'w' && (!!vc(T[rs], ['base']) || isW(T[rs], 'be')) && !vc(T[rs], ['past', '3sg']) && !PRON[T[rs].w] &&""",
    """      if (isCC && (w === 'and' || w === 'or') && je === j && rs === j + 1 && T[rs].k === 'w' && (!!vc(T[rs], ['base']) || isW(T[rs], 'be')) && !vc(T[rs], ['past', '3sg']) && !PRON[T[rs].w] && !(/^(?:tend|seem|appear|happen)$/.test(T[rs].w) && isW(T[rs + 1], 'to')) &&""")
rep("""    if (form === 'base' && vp.end + 1 < lim && (isW(T[vp.end], 'and') || isW(T[vp.end], 'or')) && !neg && !vp.neg && T[vp.end + 1].k === 'w' && (!!vc(T[vp.end + 1], ['base']) || isW(T[vp.end + 1], 'be'))""",
    """    if (form === 'base' && vp.end + 1 < lim && (isW(T[vp.end], 'and') || isW(T[vp.end], 'or')) && !neg && !vp.neg && T[vp.end + 1].k === 'w' && (!!vc(T[vp.end + 1], ['base']) || isW(T[vp.end + 1], 'be')) && !(/^(?:tend|seem|appear|happen)$/.test(T[vp.end + 1].w) && isW(T[vp.end + 2], 'to'))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
