import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my favorite way to relax → お気に入りのくつろぎ方（p544i で way + to が自動詞の「くつろぐ」になったので、既存の置換を両方に合わせる）
rep(""".replace(/くつろがせる((?:私の|彼の|彼女の)?(?:お気に入りの|好きな|一番好きな)?)方法/g, '$1くつろぎ方')""",
    """.replace(/くつろ(?:がせる|ぐ)((?:私の|彼の|彼女の)?(?:お気に入りの|好きな|一番好きな)?)方法/g, '$1くつろぎ方')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
