import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# phones could be kept in bags / the bridge could be used by cars → 保てる・使える（過去の目印のない could + 受け身は現在の可能。「保てた」にしない）
rep("""        if (!vg.perfect && !neg && !o.subjunctive && !o.wish && !o.q && verbal(p) && (T.some((x, q) => x.k === 'w' && (/^(?:future|someday|eventually|soon|tomorrow)$/.test(x.w)""",
    """        if (canPassed && !vg.perfect && !o.subjunctive && !o.wish && !o.sub && !T.some((x, q) => q !== vg.idx && x.k === 'w' && (/^(?:yesterday|ago|then|when|once)$/.test(x.w) || (x.w === 'last' && /^(?:week|year|month|night|summer|winter|spring|autumn|fall|time|weekend|century|decade)$/.test((T[q + 1] || {}).w || '')) || (x.k === 'num' && /^1[0-9]{3}$/.test(String(x.s || x.w))) || (!!vc(x, ['past']) && !vc(x, ['base', '3sg', 'pp']) && !MODAL[x.w])))) { p = canP(p); past = false; break; }
        if (!vg.perfect && !neg && !o.subjunctive && !o.wish && !o.q && verbal(p) && (T.some((x, q) => x.k === 'w' && (/^(?:future|someday|eventually|soon|tomorrow)$/.test(x.w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
