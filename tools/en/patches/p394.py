import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She said life was very different seventy years ago → 70年前は生活がとても違っていたと言った（ago / yesterday など過去の時点があれば時制の一致で現在形にしない）
rep("""    const past = (mainPast && cl.past && !cl.perfect && !dynPast) || (!mainPast && cl.modal === 'could' && !cl.perfect) ? false : undefined;""",
    """    const agoPast = mainPast && cl.past && T.slice(st0, lim).some((x, q) => x.k === 'w' && (x.w === 'ago' || x.w === 'yesterday' || (x.w === 'last' && T[st0 + q + 1] && /^(?:year|month|week|night|summer|winter|spring|fall|time|century)$/.test(T[st0 + q + 1].w || '')) || (x.k === 'num' && /^(?:1[0-9]{3}|20[0-9]{2})$/.test(x.w || ''))));
    const past = (mainPast && cl.past && !cl.perfect && !dynPast && !agoPast) || (!mainPast && cl.modal === 'could' && !cl.perfect) ? false : undefined;""")

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    ja = ja.replace(/それらと?で?(歌を歌|遊|話|食べ|踊|散歩し|笑)/g, (m0, a0) => (/^それらで/.test(m0) || /^それらと/.test(m0) ? '彼らと一緒に' : m0.replace(/^それら/, '')) + a0).replace(/(彼女|彼)の子ども時代について/g, '子ども時代について');   // sang songs with them → 彼らと一緒に歌を歌った
    ja = ja.replace(/約([^、。]{1,10}?の)([0-9０-９]+%)だけ/, '$1約$2だけ').replace(/最後の選挙/g, 'この前の選挙');   // Only about 40 percent of people in their twenties → 20代の人々の約40%だけ / the last election → この前の選挙
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
