import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# turned in the direction their species normally flies → その種がふつう飛ぶ方向に（direction / place / speed の接触節は目的語の穴なしでもよい）
rep("""      if (node.head === 'reason' && !node.pl) { fail(m); const cl6r = clause(j, e, { sub: true });""",
    """      if (/^(?:reason|direction|place|speed|order)$/.test(node.head || '') && !node.pl) { fail(m); const cl6r = clause(j, e, { sub: true });""")
rep("""/^(?:reason|time|day|year|moment|way|place|week|night|morning|evening|summer|winter|weekend|minute|hour|month)$/.test(node.head || '') && T[j + 1].k === 'w'""",
    """/^(?:reason|time|day|year|moment|way|place|week|night|morning|evening|summer|winter|weekend|minute|hour|month|direction|speed)$/.test(node.head || '') && T[j + 1].k === 'w'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
