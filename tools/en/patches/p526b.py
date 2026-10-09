import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It began to pour → 雨が激しく降り始めた（天候の it + pour は 雨が激しく降る。それは激しく降った にしない）
rep("""    } else if (usedGap) sp = 'SVO';
    const r = done(vg, core, st, j, sp, o, strs);
    if (gaObj) r.gaObj = strs[0];""",
    """    } else if (usedGap) sp = 'SVO';
    if (o.subj && o.subj.pron === 'it' && objs.length === 0 && L === 'pour' && !vg.passive && /降る$/.test(sense.core || '')) { sense = Object.assign({}, sense, { core: '雨が激しく降る' }); core = P('雨が激しく降る', 'v5'); }
    const r = done(vg, core, st, j, sp, o, strs);
    if (gaObj) r.gaObj = strs[0];""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
