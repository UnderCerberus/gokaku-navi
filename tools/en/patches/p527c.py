import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# students living far away / people living close by → 遠くに住んでいる生徒（分詞 + far away / close も後置修飾。生徒の生計 にしない）
rep("""/^(?:alone|together|apart|there|here|abroad|overseas|nearby|independently)$/.test(T[j + 1].w)))) break;   // people living alone""",
    """(/^(?:alone|together|apart|there|here|abroad|overseas|nearby|independently)$/.test(T[j + 1].w) || (/^(?:far|close)$/.test(T[j + 1].w) && /^(?:away|from|to|by)$/.test((T[j + 2] || {}).w || '')))))) break;   // people living alone""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
