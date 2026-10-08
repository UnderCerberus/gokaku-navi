import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""(T[0].w === 'today' && isP(T[1], ',') && !!o.subj.pl)) && !T.some((x) => x.k === 'w' && /^(?:every|usually|often|always|sometimes|tomorrow|tonight|soon)$/.test(x.w))""",
    """(T[0].w === 'today' && isP(T[1], ',') && (!!o.subj.pl || /^(?:people|children|men|women|students|families|companies|teenagers|consumers|shoppers|tourists|workers|farmers)$/.test(o.subj.head || '')))) && !T.some((x) => x.k === 'w' && /^(?:every|usually|often|always|sometimes|tomorrow|tonight|soon)$/.test(x.w)) && !T.some((x, q) => x.w === 'more' && isW(T[q + 1], 'and') && isW(T[q + 2], 'more'))""")

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'now i understand': 'やっと分かった', 'now i see': 'なるほど、分かった', 'now i know': 'これで分かった', """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
