import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# did not reduce how often they yawned → …かを減らさなかった（変える・減らす類の動詞の疑問詞節には「を」）
rep("""        return done(vg, cw2, st, wc.end, 'SVO', o, [wc.str + (wc.isNoun ? (sn2.particle || 'を') : '')]);""",
    """        return done(vg, cw2, st, wc.end, 'SVO', o, [wc.str + (wc.isNoun ? (sn2.particle || 'を') : (/^(?:affect|influence)$/.test(L) ? 'に' : (/^(?:reduce|increase|change|improve|shape|limit|plan|control|determine)$/.test(L) ? 'を' : '')))]);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
