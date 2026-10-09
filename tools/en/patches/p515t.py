import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# people who eat breakfast regularly tend to … → 定期的に朝食を食べる人々は（関係詞節の目的語のあとの様態の副詞は関係詞節の中）
rep("""        !(s - 2 > a && T[s - 2].k === 'w' && !!vc(T[s - 2], ['base', '3sg', 'past']) && !MODAL[T[s - 2].w] && T.slice(a, s - 2).some((x) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w)))) s--;""",
    """        !(s - 2 > a && T[s - 2].k === 'w' && !!vc(T[s - 2], ['base', '3sg', 'past']) && !MODAL[T[s - 2].w] && T.slice(a, s - 2).some((x) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w))) &&
        !(s - 3 > a && T[s - 1].k === 'w' && /^(?:regularly|daily|properly|carefully|correctly|safely|regularly|abroad|outdoors|online|together|alone|hard|well|frequently|every day)$/.test(T[s - 1].w) && T[s - 2].k === 'w' && !!nounC(T[s - 2]) && (() => { const r0 = T.slice(a, s - 2).findIndex((x) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w)); return r0 >= 0 && T.slice(a + r0 + 1, s - 2).some((x) => x.k === 'w' && !!vc(x, ['base', '3sg', 'past']) && !nounC(x)); })())) s--;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
