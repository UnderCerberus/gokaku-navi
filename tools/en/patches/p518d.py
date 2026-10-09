import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# never fails to（never は動詞の前の副詞として vg.advs にある）
rep("""  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && vg.neg), exp: false,""",
    """  const newSt = (vg) => ({ neg: false, vgNeg: !!(vg && vg.neg), vgNever: !!(vg && vg.advs && vg.advs.some((x) => x.w === 'never')), exp: false,""")
rep("""    fail: (p, st) => { if (st.never || st.vgNeg) {""",
    """    fail: (p, st) => { if (st.never || st.vgNeg || st.vgNever) {""")
rep("""    (vg.advs || []).forEach((x) => addAdv(st, x.a, x.w));""",
    """    (vg.advs || []).forEach((x) => { if (st.failNeg && x.w === 'never') return; addAdv(st, x.a, x.w); });   // never fails to → 必ず（決して を付けない）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
