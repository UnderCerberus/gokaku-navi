import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# even those sitting in the front row → 最前列に座っている人々（people sitting … と同じく「〜している」。座る人々 にしない）
rep("""return { ja: vpJoin(vTl, 'dict').replace(/る$/, 'る').replace(/(?:住む|暮らす|働く)$/, (x) => x.replace(/む$/, 'んでいる').replace(/す$/, 'している').replace(/く$/, 'いている')) + '人々', end: vTl.end, an: true, pl: true, head: 'people' };""",
    """return { ja: vTl.parts.join('') + (/^(?:mean|contain|include|belong|resemble|represent|own|weigh|cost|require|lack|consist|depend)$/.test((vTl.vg || {}).lemma || '') ? vTl.pred.plain() : noDouble(vTl.pred).plain()) + '人々', end: vTl.end, an: true, pl: true, head: 'people' };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
