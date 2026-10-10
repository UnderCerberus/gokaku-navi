import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# understanding why we delay → なぜ私たちが先延ばしにするのかを理解すること（関係副詞の why は reason の後ろだけ。understanding を why の先行詞にしない）
rep("""    if ((w === 'where' || w === 'when' || w === 'why') && j + 2 < e && !(w === 'when' && (node.dur""",
    """    if ((w === 'where' || w === 'when' || w === 'why') && j + 2 < e && !(w === 'why' && !/^(?:reason|reasons)$/.test(node.head || '')) && !(w === 'when' && (node.dur""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
