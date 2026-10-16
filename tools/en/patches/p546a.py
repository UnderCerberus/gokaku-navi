import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# require too much space → スペースを必要としすぎる（too much + space の経路でも「宇宙」にしない。p545z の続き）
rep("""      if (nomTM) return postMod({ ja: nomTM.ja, end: nomTM.end, head: nomTM.head, pl: nomTM.pl, an: nomTM.an, c: nomTM.c, tooMuch: true }, lim, o);""",
    """      if (nomTM) return postMod({ ja: nomTM.head === 'space' ? nomTM.ja.replace(/宇宙$/, 'スペース') : nomTM.ja, end: nomTM.end, head: nomTM.head, pl: nomTM.pl, an: nomTM.an, c: nomTM.c, tooMuch: true }, lim, o);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
