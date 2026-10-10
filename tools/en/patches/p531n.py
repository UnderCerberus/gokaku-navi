import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the experience made me want to help others → 私に…助けたいと思わせた（make + 目的語 + want to: 「思っている」の使役は「思わせる」）
rep("""        const cp = (L === 'make' || L === 'let') && v3.sp === 'SV' ? 'を' : CAUS[L][0];
        return done(vg, CAUS[L][1](v3.neg ? v3.pred.aux('neg') : v3.pred, st), st, v3.end, 'SVOC', o, [objStr(ob, cp, st)].concat(v3.parts), { noStative: true });""",
    """        const cp = (L === 'make' || L === 'let') && v3.sp === 'SV' ? 'を' : CAUS[L][0];
        if (L === 'make' && !v3.neg && v3.vg && v3.vg.lemma === 'want' && /と思っている$/.test(v3.pred.plain())) return done(vg, P(v3.pred.plain().replace(/と思っている$/, 'と思わせる'), 'v1'), st, v3.end, 'SVOC', o, [objStr(ob, 'に', st)].concat(v3.parts), { noStative: true });
        return done(vg, CAUS[L][1](v3.neg ? v3.pred.aux('neg') : v3.pred, st), st, v3.end, 'SVOC', o, [objStr(ob, cp, st)].concat(v3.parts), { noStative: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
