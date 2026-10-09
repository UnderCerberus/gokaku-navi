import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# people can enjoy such clean air and water → きれいな空気と水を楽しめる（名詞 and 不可算名詞（water など）で目的語のない右側は述語の並列にしない。水をやったり にしない）
rep("""        if (x - 2 > v0 && T[x - 2].k === 'w' && PREP[T[x - 2].w] && !!nounC(T[x - 1]) && !!nounC(T[x + 1]) && (x + 2 >= b || T[x + 2].k === 'p')) return null;   // regardless of age or experience""",
    """        if (x - 2 > v0 && T[x - 2].k === 'w' && PREP[T[x - 2].w] && !!nounC(T[x - 1]) && !!nounC(T[x + 1]) && (x + 2 >= b || T[x + 2].k === 'p')) return null;   // regardless of age or experience
        if (T[x - 1].k === 'w' && !!nounC(T[x - 1]) && !vc(T[x - 1], ['base']) && !!nounC(T[x + 1]) && /^(?:water|milk|juice|tea|coffee|food|air|sunlight|fuel|oil|gas|electricity|bread|rice|meat|salt|sugar|soil|sand|wood|paper|clothing|furniture|equipment)$/.test(T[x + 1].w) && (x + 2 >= b || T[x + 2].k === 'p' || (T[x + 2].k === 'w' && (!!PREP[T[x + 2].w] || !!ADV[T[x + 2].w])))) return null;   // enjoy clean air and water""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
