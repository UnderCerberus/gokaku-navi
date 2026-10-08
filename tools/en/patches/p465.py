import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# An increasing number of tourists visit Japan → a growing number of と同じく読む
rep(""".replace(/\\b[Tt]eachers' (?:room|office|lounge)\\b/g, 'staffroom')""",
    """.replace(/\\b([Aa]n) increasing number of\\b/g, (m0, a0) => (a0 === 'An' ? 'A' : 'a') + ' growing number of').replace(/\\b[Tt]eachers' (?:room|office|lounge)\\b/g, 'staffroom')""")

rep("""    ja = ja.replace(/知識の隙間/g, '知識の空白')""",
    """    ja = ja.replace(/広範囲の/g, '幅広い').replace(/大量のお金/g, '多額のお金');   // a wide range of programs → 幅広いプログラム / a large amount of money → 多額のお金
    ja = ja.replace(/知識の隙間/g, '知識の空白')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
