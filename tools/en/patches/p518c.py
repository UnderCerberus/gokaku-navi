import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He never fails to call his mother → 必ず母に電話する（never / not + fail to do は二重否定。「決して…できない」にしない）
rep("""    fail: (p, st) => { st.neg = true; return p.aux('can'); },""",
    """    fail: (p, st) => { if (st.never || st.vgNeg) { st.never = false; st.failNeg = true; st.manner.unshift('必ず'); return p; } st.neg = true; return p.aux('can'); },""")
rep("""    let p = core, past = vg.past, neg = vg.neg || !!st.neg;""",
    """    let p = core, past = vg.past, neg = (vg.neg && !st.failNeg) || !!st.neg;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
