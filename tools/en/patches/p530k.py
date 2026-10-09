import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it can make education more flexible and open to everyone → 教育をより柔軟で誰にでも開かれたものにできる
# （make / keep / be + … + 形容詞 and 形容詞 は形容詞の並列。右の open を主語を共有する述語にしない）
rep("""        if (!rv && !npAndR) rv = left.subj && !thatLeft""",
    """        const adjAndR = w === 'and' && je === j && T[j - 1] && T[j - 1].k === 'w' && !!adjC(T[j - 1]) && !nounC(T[j - 1]) && T[rs] && T[rs].k === 'w' && !!adjC(T[rs]) && T.slice(a, je).some((x) => x.k === 'w' && /^(?:make|makes|made|keep|keeps|kept|find|finds|found|leave|leaves|left)$/.test(x.w));
        if (adjAndR) { const mAj = mark(); const wAj = clause(a, b, o); if (wAj) return wrap(wAj); fail(mAj); }
        if (!rv && !npAndR) rv = left.subj && !thatLeft""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
