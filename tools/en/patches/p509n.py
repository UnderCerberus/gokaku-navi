import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# than they would like (to) / than I wanted (to) / than we expected → 自分が望む・予想した（比較の省略節）
rep("""  function thanEllipsis(i, lim, mainSj) {
    if (i < lim && lim - i <= 8 && lim - i >= 3) {""",
    """  function thanEllipsis(i, lim, mainSj) {
    if (i + 1 < lim && lim - i <= 5 && T[i].k === 'w' && PRON[T[i].w] && PRON[T[i].w].sub) {
      const kW = MODAL[(T[i + 1] || {}).w] ? i + 2 : i + 1;
      const wv = T[kW] && T[kW].k === 'w' ? vc(T[kW], ['base', 'past', '3sg']) : null;
      const WISH = { like: '望む', want: '望む', wish: '望む', expect: '予想する', plan: '予定する', intend: '意図する', hope: '望む', need: '必要とする', think: '思う', imagine: '想像する' };
      if (wv && WISH[wv.lemma] && (kW + 1 === lim || (isW(T[kW + 1], 'to') && kW + 2 === lim))) {
        const pj = P(WISH[wv.lemma]);
        const pastW = !!vc(T[kW], ['past']) && !vc(T[kW], ['base']);
        const same = mainSj && mainSj.pron && samePerson(mainSj.pron, T[i].w);
        return (same ? '自分が' : (PRON[T[i].w].ja || '') + 'が') + (pastW ? pj.form('past') : pj.plain());
      }
    }
    if (i < lim && lim - i <= 8 && lim - i >= 3) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
