import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    const agoPast = mainPast && cl.past && T.slice(st0, lim).some((x, q) => x.k === 'w' && (x.w === 'ago' || x.w === 'yesterday' || (x.w === 'last' && T[st0 + q + 1] && /^(?:year|month|week|night|summer|winter|spring|fall|time|century)$/.test(T[st0 + q + 1].w || '')) || (x.k === 'num' && /^(?:1[0-9]{3}|20[0-9]{2})$/.test(x.w || ''))));""",
    """    const agoPast = mainPast && cl.past && T.slice(st0, lim).some((x, q) => (x.k === 'w' && (x.w === 'ago' || x.w === 'yesterday' || (x.w === 'last' && T[st0 + q + 1] && /^(?:year|month|week|night|summer|winter|spring|fall|time|century)$/.test(T[st0 + q + 1].w || '')))) || (x.k === 'num' && /^(?:1[0-9]{3}|20[0-9]{2})$/.test(String(x.w || '')) && T[st0 + q - 1] && T[st0 + q - 1].w === 'in'));""")

rep("""    ja = ja.replace(/約([^、。]{1,10}?の)([0-9０-９]+%)だけ/, '$1約$2だけ')""",
    """    ja = ja.replace(/([0-9０-９]+年前)に([^、。]{0,8}?)異なった/, '$1は$2違っていた').replace(/が([0-9０-９]+年前)はとても違っていた/, 'は$1とても違っていた').replace(/約([^、。]{1,10}?の)([0-9０-９]+%)だけ/, '$1約$2だけ')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
