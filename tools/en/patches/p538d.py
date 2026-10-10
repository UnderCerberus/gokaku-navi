import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They might know each other → 知り合いかもしれない（既存の置換: かもしれない・だろう の前は だ を落とす）
rep("""    ja = ja.replace(/お互い(長い間|何年も|ずっと)?知っている/g, (m0, a0) => (a0 || '') + '知り合いだ');""",
    """    ja = ja.replace(/お互い(長い間|何年も|ずっと)?知っている(かもしれない|だろう)?/g, (m0, a0, b0) => (a0 || '') + '知り合い' + (b0 || 'だ'));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
