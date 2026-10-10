import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He carried the box out / checking each plate before carrying it out → 箱を運び出した・それを運び出す（物の目的語の carry ~ out は「運び出す」。carry out the plan は 実行する のまま）
rep("""  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;""",
    """  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;
    if (vg.lemma === 'carry' && !vg.passive && i < lim) {
      const CONC = /^(?:box|boxes|plate|plates|dish|dishes|tray|trays|bag|bags|chair|chairs|table|tables|food|garbage|trash|bottle|bottles|cup|cups|bed|desk|desks|furniture|luggage|suitcase|suitcases|bucket|buckets|basket|baskets|tool|tools)$/;
      const mCo = mark();
      const obC = objBefore(i, lim, (x) => isW(x, 'out'));
      const concC = !!obC && obC.end < lim && isW(T[obC.end], 'out') && (CONC.test(obC.head || '') || (/^(?:it|them)$/.test(obC.pron || '') && T.some((x) => x.k === 'w' && CONC.test(x.w))));
      if (concC) { name('idiom'); return done(vg, P('運び出す', 'v5'), st, tail(obC.end + 1, lim, st, o, vg), 'SVO', o, [objStr(obC, 'を', st)], { noStative: true }); }
      fail(mCo);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
