import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as much as → 〜ほど・〜と同じくらい（much の「ずっと」は出さない）
rep("""        const a0 = wellAs ? { ja: '上手に' } : advC(T[ja0 + 1]), pre0 = ja0 > j ? (isW(t, 'just') ? 'ちょうど' : 'ほとんど') : '';""",
    """        const a0 = wellAs ? { ja: '上手に' } : (isW(T[ja0 + 1], 'much') ? { ja: '' } : advC(T[ja0 + 1])), pre0 = ja0 > j ? (isW(t, 'just') ? 'ちょうど' : 'ほとんど') : '';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
