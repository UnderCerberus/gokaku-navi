import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# scored lower on reading tests than pupils at a quieter school → より静かな学校の生徒より（比較級の副詞 + 前置詞句 + than + 名詞句 + 前置詞句: than のあとの名詞句に前置詞句をつける）
rep("""          let nP = elP ? null : np(pc1.end + 1, lim, {});""",
    """          let nP = elP ? null : np(pc1.end + 1, lim, {});
          if (nP && nP.end < lim && T[nP.end].k === 'w' && !!PREP[T[nP.end].w]) { const mPq = mark(); const nP2 = np(pc1.end + 1, lim, { pp: true }); if (nP2 && nP2.end > nP.end) nP = nP2; else fail(mPq); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
