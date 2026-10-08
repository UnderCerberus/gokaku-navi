import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        ja += (PN[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + (t.w === 'lake' ? '湖' : '山');""",
    """        ja += (PN[T[j + 1].w] || NAME_JA[T[j + 1].w] || T[j + 1].s || T[j + 1].w) + (t.w === 'lake' ? '湖' : '山');   // Mt. Takao → 高尾山""")
rep("""!/(?:も|もまた)/.test(ja.slice(0, 6))) ja = ja.replace(/^(私|彼|彼女|私たち|彼ら|あなた|僕)は/, '$1も');""",
    """!/(?:も|もまた)/.test(ja.slice(0, 6)) && !/^[^、。]{1,10}?は[^。]*も/.test(ja)) ja = ja.replace(/^([^、。]{1,10}?)は/, '$1も');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
