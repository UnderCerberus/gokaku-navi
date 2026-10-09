import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the loss of sleep can have serious effects on … → 深刻な影響を与えることがある（与えられる は受け身に読める）
rep("""threaten|interfere|undermine|delay)$/.test(vg.lemma) && verbal(p)) p = P(p.plain() + 'ことがある', 'aru');""",
    """threaten|interfere|undermine|delay|have)$/.test(vg.lemma) && (vg.lemma !== 'have' || T.some((x) => x.k === 'w' && /^(?:effect|effects|impact|impacts|influence|consequence|consequences)$/.test(x.w))) && verbal(p)) p = P(p.plain() + 'ことがある', 'aru');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
