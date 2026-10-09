import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# those who were read to every day → 毎日本を読んでもらった（to every day を前置詞句にしない。下の read to の規則に回す）
rep("""    for (let guard = 0; guard < 14 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      let k = modFixed(j0, lim, st);""",
    """    for (let guard = 0; guard < 14 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      if (vg.passive && vg.lemma === 'read' && !objs.length && j0 === j && isW(T[j0], 'to') && T[j0 + 1] && T[j0 + 1].k === 'w' && /^(?:every|often|regularly|daily|aloud|as)$/.test(T[j0 + 1].w)) break;   // were read to every day
      let k = modFixed(j0, lim, st);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
