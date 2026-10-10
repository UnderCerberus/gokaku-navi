import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Kindness, I learned, is often passed … → 私が学んだところでは、親切は…（learn / find / realize / discover などの挿入）
rep("""          if (vb && (SAYV[vb.lemma] || THINKV[vb.lemma]) && vb.lemma !== 'add') {""",
    """          if (vb && (SAYV[vb.lemma] || THINKV[vb.lemma] || /^(?:learn|find|discover|realize|realise|know|hear|notice|understand|remember|recall|fear|hope)$/.test(vb.lemma)) && vb.lemma !== 'add') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
