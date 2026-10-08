import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep(""".replace(/暑い日に安心を持ってこられる/g, '暑い日には和らぎをもたらしてくれる')""",
    """.replace(/安心を(?:持ってこられる|もたらせる)/g, '和らぎをもたらしてくれる').replace(/暑い日に和らぎ/g, '暑い日には和らぎ')""")

rep("""    if (tokens.some((x, k) => x.w === 'such' && tokens[k + 1] && tokens[k + 1].w === 'as')) ja = ja.replace(/([^、。をがはにでとや]{1,12})と([^、。をがはにでとや]{1,12})のような/g, '$1や$2などの');""",
    """    if (tokens.some((x, k) => (x.w === 'such' && tokens[k + 1] && tokens[k + 1].w === 'as') || x.w === 'like')) ja = ja.replace(/((?:[^、。をがはにでとや（）「」]{1,12}と){1,4}[^、。をがはにでとや（）「」]{1,12})のような/g, (m0, a0) => { const it0 = a0.split('と'); return it0[0] + 'や' + it0.slice(1).join('、') + 'などの'; });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
