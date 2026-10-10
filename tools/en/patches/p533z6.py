import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Her last class is on the 28th, so we could … → 見せられる（提案・可能性の could の判定: last は last week / last year などの時の句のときだけ過去の目印）
rep("""if (!vg.perfect && !o.subjunctive && !o.wish && !o.q && verbal(p) && !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:yesterday|ago|then|last|when)$/.test(x.w) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg', 'pp']) && !MODAL[x.w]))) &&""",
    """if (!vg.perfect && !o.subjunctive && !o.wish && !o.q && verbal(p) && !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:yesterday|ago|then|when)$/.test(x.w) || (x.w === 'last' && /^(?:week|year|month|night|summer|winter|spring|autumn|fall|time|weekend|sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/.test((T[q + 1] || {}).w || '')) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg', 'pp']) && !MODAL[x.w]))) &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
