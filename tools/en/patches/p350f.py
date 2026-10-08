import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""  function parsePP(i, lim, o) {
    o = o || {};
    const t = T[i];
    if (!t || i >= lim || t.k !== 'w' || approxAt(i, lim)) return null;""",
    """  function parsePP(i, lim, o) {
    o = o || {};
    const t = T[i];
    if (!t || i >= lim || t.k !== 'w' || (approxAt(i, lim) && !o.allowApprox)) return null;""")

rep("""        const stOv = newSt(vg);
        const kOv = tail(j0, j0 + 3, stOv, o, vg);
        if (kOv === j0 + 3 && stOv.other.concat(stOv.time).length) { stOv.other.concat(stOv.time).forEach((x) => st.other.push(x)); j = j0 + 3; continue; }""",
    """        const mOv = mark();
        const pOv = parsePP(j0, j0 + 3, { allowApprox: true });
        if (pOv && pOv.end === j0 + 3 && /(?:かけて|にわたって)$/.test(pOv.ja)) { st.other.push(pOv.ja); j = j0 + 3; continue; }
        fail(mOv);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
