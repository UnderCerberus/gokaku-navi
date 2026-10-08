import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# expensive の第一語義を 高い にしたので、高価 を手がかりにしていた置換を 高い にも効かせる
rep(""".replace(/ことが高価だ/g, 'ことはお金がかかる')""",
    """.replace(/ことが高(?:価だ|い)(?=。|$|という|と)/g, 'ことはお金がかかる')""")
rep(""".replace(/倍高価だ/g, '倍の値段だ')""",
    """.replace(/倍高(?:価だ|い)(?=。|$)/g, '倍の値段だ')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
