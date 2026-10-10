import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# offered them free desserts / free tickets → 無料のデザート（free + 品物・サービス → 無料の。自由な にしない）
rep("""  const ADJN = COLL([
""",
    """  const ADJN = COLL([
    'free|dessert desserts meal meals ticket tickets drink drinks sample samples admission entry gift gifts coffee lunch dinner food parking shipping delivery wifi trial lesson lessons bus buses ride rides water snack snacks copy copies app apps|無料の',
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
