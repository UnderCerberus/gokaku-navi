import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for only a few weeks → わずか数週間 / about a few days → 約数日（about / only + a few / a couple of）
rep("""      if (nxn.k === 'num' || NUMW[nxn.w] !== undefined || ((nxn.w === 'a' || nxn.w === 'an') && T[i + 2] && (NUMMUL[T[i + 2].w] || /^(?:third|quarter|fifth)$/.test(T[i + 2].w) || (i + 2 < lim && T[i + 2].k === 'w' && UNIT[T[i + 2].w])))) {   // about a week → 約1週間
        const inn = np1(i + 1, lim, Object.assign({}, o, { noApprox: true, noTimePh: true }));   // only one day は「ある日」ではなく「わずか1日」
        if (inn && (inn.num || inn.frac || (T[i + 1].k === 'num' && /^[0-9０-９]/.test(inn.ja || '')))) {""",
    """      const aFew = nxn.w === 'a' && T[i + 2] && /^(?:few|couple)$/.test(T[i + 2].w) && /^(?:only|just|about|around|nearly|almost|over)$/.test(t.w);   // only a few weeks → わずか数週間
      if (nxn.k === 'num' || NUMW[nxn.w] !== undefined || aFew || ((nxn.w === 'a' || nxn.w === 'an') && T[i + 2] && (NUMMUL[T[i + 2].w] || /^(?:third|quarter|fifth)$/.test(T[i + 2].w) || (i + 2 < lim && T[i + 2].k === 'w' && UNIT[T[i + 2].w])))) {   // about a week → 約1週間
        const inn = np1(i + 1, lim, Object.assign({}, o, { noApprox: true, noTimePh: true }));   // only one day は「ある日」ではなく「わずか1日」
        if (inn && (inn.num || inn.frac || (T[i + 1].k === 'num' && /^[0-9０-９]/.test(inn.ja || '')) || (aFew && /^(?:数|2、3)/.test(inn.ja || '')))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
