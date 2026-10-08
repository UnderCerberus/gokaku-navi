import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()
def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)
rep("""    const cl = sentence(st0, lim, { sub: true });
    if (!cl) return fail(m);
    name('that-clause');""",
    """    const cl = sentence(st0, lim, { sub: true, reported: !!mainPast });
    if (!cl) return fail(m);
    name('that-clause');""")
rep("""    const mainOpt = (sc, key) => Object.assign({}, o, { subjunctive: key === 'if' && !!sc.past });""",
    """    const mainOpt = (sc, key) => Object.assign({}, o, { subjunctive: key === 'if' && !!sc.past && !o.reported });   // He said that if he had time, he would come（過去の伝達の中の if + 過去は仮定法ではない）""")
io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
