import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is not easy for elderly people living alone to go shopping → 一人暮らしの高齢者が買い物に行くのは簡単ではない（for の名詞句が分詞で修飾されていても、to の手前までを名詞句で読む）
rep("""      if ((isW(T[k2], 'for') || isW(T[k2], 'of')) && k2 + 2 < b) {
        const n = np(k2 + 1, b, { noRel: true, noCoord: true });
        if (n && isW(T[n.end], 'to')) { if (T[k2].w === 'for') forNP = n; else ofNP = n; k2 = n.end; }
      }""",
    """      if ((isW(T[k2], 'for') || isW(T[k2], 'of')) && k2 + 2 < b) {
        const n = np(k2 + 1, b, { noRel: true, noCoord: true });
        if (n && isW(T[n.end], 'to')) { if (T[k2].w === 'for') forNP = n; else ofNP = n; k2 = n.end; }
        else if (isW(T[k2], 'for')) { const ftI = forTo(k2, b); if (ftI.np && isW(T[ftI.end], 'to')) { forNP = ftI.np; k2 = ftI.end; } }
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
