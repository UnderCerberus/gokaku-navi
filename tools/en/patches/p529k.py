import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Individuals can … buying only what they will actually eat → 彼らが（individuals / individual は人。それら にしない）
rep("""    'owner manager employee employer worker boss chef baker shopkeeper clerk soldier general lawyer professor coach player athlete runner swimmer');""",
    """    'owner manager employee employer worker boss chef baker shopkeeper clerk soldier general lawyer professor coach player athlete runner swimmer individual individuals');""")

# He eats only what he likes / buying only what they will eat → 好きなものだけを食べる（既存の置換を こと にも効くように直す）
rep(""".replace(/ものをただ(買|食べ|使|持|読|選)/g, 'ものだけを$1')""",
    """.replace(/(?:もの|こと)をただ(買|食べ|使|持|読|選|運)/g, 'ものだけを$1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
