import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Prices change depending on the season → 物価は季節によって変わる（depending on は前置詞。動名詞の目的語にしない）
rep("""  function ingVerb(j, lim) {
    const t = T[j];""",
    """  function ingVerb(j, lim) {
    const t = T[j];
    if (t && t.k === 'w' && t.w === 'depending' && isW(T[j + 1], 'on')) return false;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
