import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# People can enjoy clean air and water here（名詞 and + 不可算名詞（water など）+ 前置詞句・副詞・文末 は主語を共有する述語の並列にしない → きれいな空気と水を楽しめる）
rep("""        if (!rv) rv = left.subj && !thatLeft && !(T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && !!vc(T[rs], ['3sg'])""",
    """        const npAndR = w === 'and' && je === j && T[j - 1] && T[j - 1].k === 'w' && !!nounC(T[j - 1]) && !vc(T[j - 1], ['base', '3sg', 'past']) && T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && /^(?:water|milk|juice|tea|coffee|food|air|sunlight|fuel|oil|gas|electricity|bread|rice|meat|salt|sugar|soil|sand|wood|paper|clothing|furniture|equipment)$/.test(T[rs].w) && (rs + 1 >= b || T[rs + 1].k === 'p' || (T[rs + 1].k === 'w' && (!!PREP[T[rs + 1].w] || !!ADV[T[rs + 1].w])));
        if (!rv && !npAndR) rv = left.subj && !thatLeft && !(T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && !!vc(T[rs], ['3sg'])""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
