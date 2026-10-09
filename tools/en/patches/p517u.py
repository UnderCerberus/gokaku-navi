import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# could have been eaten if … → 食べられただろうに（受け身の「られる」に可能の「ことができる」を重ねない）
rep("""          p = subjv ? P((neg ? p.aux('can').aux('neg') : p.aux('can')).form('past') + 'だろう' + (neg ? '' : 'に'), 'fix')""",
    """          p = subjv ? P((neg ? (vg.passive ? p : p.aux('can')).aux('neg') : (vg.passive ? p : p.aux('can'))).form('past') + 'だろう' + (neg ? '' : 'に'), 'fix')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
