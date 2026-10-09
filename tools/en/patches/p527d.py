import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# students living far away / people living close to the station → 遠くに住んでいる生徒・駅の近くに住んでいる人々（-ing + far away / close to も分詞の後置修飾）
rep("""PLACE_ADV[T[j + 1].w] || /^(?:alone|together|apart|independently|nearby|abroad|upstairs|downstairs)$/.test(T[j + 1].w) || seq(j + 1, ['next', 'door']));   // people living alone → 一人暮らしの人々""",
    """PLACE_ADV[T[j + 1].w] || /^(?:alone|together|apart|independently|nearby|abroad|upstairs|downstairs)$/.test(T[j + 1].w) || seq(j + 1, ['next', 'door']) || (/^(?:far|close)$/.test(T[j + 1].w) && /^(?:away|from|to|by)$/.test((T[j + 2] || {}).w || '')));   // people living alone → 一人暮らしの人々""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
