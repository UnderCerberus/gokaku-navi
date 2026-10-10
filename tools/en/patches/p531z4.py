import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# To everyone's surprise, …（所有格の 's も決まり文句のキーに含める: "to everyone 's surprise"）
rep("""    for (let x = 0; x < len; x++) { const t = T[j + x]; if (!t || t.k !== 'w') return ''; ws.push(t.w); }""",
    """    for (let x = 0; x < len; x++) { const t = T[j + x]; if (!t || (t.k !== 'w' && t.k !== 'pos')) return ''; ws.push(t.w); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
