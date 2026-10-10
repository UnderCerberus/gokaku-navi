import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# We feel worse than we did → 以前より（主節が現在で、同じ主語 + did）
rep("""    if (i + 2 === lim && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub && isW(T[i + 1], 'did') && mainSj && mainSj.pron && samePerson(mainSj.pron, T[i].w) && T.slice(0, i).some((x) => x.k === 'w' && /^(?:do|does|don't|doesn't|is|are|am|can)$/.test(x.w))) return '以前';""",
    """    if (i + 2 === lim && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub && isW(T[i + 1], 'did') && mainSj && mainSj.pron && samePerson(mainSj.pron, T[i].w) && (T.slice(0, i).some((x) => x.k === 'w' && /^(?:do|does|don't|doesn't|is|are|am|can)$/.test(x.w)) || !T.slice(0, i).some((x) => x.k === 'w' && !!vc(x, ['past']) && !vc(x, ['base'])))) return '以前';""")

# we feel even worse than we did at the beginning → 初めより
rep("""        else if (seq(xb + 1, ['in', 'the', 'past']) && xb + 4 === lim) tj = '以前';""",
    """        else if (seq(xb + 1, ['in', 'the', 'past']) && xb + 4 === lim) tj = '以前';
        else if ((seq(xb + 1, ['at', 'the', 'beginning']) || seq(xb + 1, ['at', 'the', 'start'])) && xb + 4 === lim) tj = '初め';
        else if (seq(xb + 1, ['at', 'first']) && xb + 3 === lim) tj = '最初';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
