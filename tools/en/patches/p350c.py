import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for + 距離 の規則を switch の前へ移す
old_for1 = """    if (key === 'for' && /^何(?:十|百|千|万)?(?:キロメートル|メートル|マイル|キロ)もの?$/.test(n)) return R(n.replace(/もの?$/, '') + 'にもわたって', 'dur', n.replace(/も$/, '') + 'にもわたる');   // stretches for thousands of kilometers → 何千キロメートルにもわたって
"""
assert s.count(old_for1) == 1, s.count(old_for1)
s = s.replace(old_for1, '')
old_for2_start = "    if (key === 'for' && obj.num && obj.head && /^(?:kilometers|kilometres|miles|meters|metres|km|kilometer|mile|meter)$/.test(obj.head)"
i0 = s.index(old_for2_start)
i1 = s.index('\n', i0) + 1
for2 = s[i0:i1]
s = s[:i0] + s[i1:]

rep("""    const R = (ja, kind, adn) => ({ ja: ja, kind: kind || 'other', adn: adn || adnOf(ja) });
    switch (key) {
      case 'of': return R(n + 'の', 'of', n + 'の');""",
    """    const R = (ja, kind, adn) => ({ ja: ja, kind: kind || 'other', adn: adn || adnOf(ja) });
    if (key === 'for' && /^何(?:十|百|千|万)?(?:キロメートル|メートル|マイル|キロ)もの?$/.test(n)) return R(n.replace(/もの?$/, '') + 'にもわたって', 'dur', n.replace(/もの?$/, '') + 'にもわたる');   // stretches for thousands of kilometers → 何千キロメートルにもわたって
""" + for2 + """    switch (key) {
      case 'of': return R(n + 'の', 'of', n + 'の');""")

# was built over ten years（受け身の後ろの over + 数 + 期間 は前置詞句）
rep("""    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w]) && !approxAt(j, lim)) {""",
    """    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w]) && (!approxAt(j, lim) || (isW(t, 'over') && vg && vg.passive && T[j + 1] && (T[j + 1].k === 'num' || NUMW[T[j + 1].w] !== undefined) && T[j + 2] && !!DURUNIT[(T[j + 2].w || '').replace(/s$/, '')]))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
