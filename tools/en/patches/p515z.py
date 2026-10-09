import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Nothing has changed our lives as much as the internet has → インターネットほど（否定の主語のときも ほど）
rep("""        const cmp0 = vg && vg.neg && !pre0 ? 'ほど' : 'と同じくらい';   // He can't run as fast as Ken → ケンほど速く走れない""",
    """        const cmp0 = ((vg && vg.neg) || T.slice(0, j).some((x) => x.k === 'w' && /^(?:nothing|nobody|none|no|never)$/.test(x.w))) && !pre0 ? 'ほど' : 'と同じくらい';   // He can't run as fast as Ken → ケンほど速く走れない""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
