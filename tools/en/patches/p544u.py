import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# wrote down every step on a piece of paper → 1枚の紙に書き留めた（既存の置換を「を」以外の 1つの紙 にも広げる。「1つの紙に」にしない）
rep(""".replace(/1つの紙を/g, '紙を1枚')""",
    """.replace(/1つの紙(を)?/g, (m0, w0) => (w0 ? '紙を1枚' : '1枚の紙'))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
