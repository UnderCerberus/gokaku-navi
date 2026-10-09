import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# This is what is called a win-win situation → これはいわゆる双方に利益のある状況だ（what is called / what we call + 名詞）
rep("""  function whatClause(i, lim) {
    if (i + 2 > lim || DEPTH > 4) return null;
    const m = mark();
""", """  function whatClause(i, lim) {
    if (i + 2 > lim || DEPTH > 4) return null;
    const m = mark();
    if ((seq(i, ['what', 'is', 'called']) || seq(i, ['what', 'was', 'called']) || seq(i, ['what', 'we', 'call']) || seq(i, ['what', 'people', 'call']) || seq(i, ['what', 'they', 'call']) || seq(i, ['what', 'you', 'call'])) && i + 3 < lim) {
      const nWc = np(i + 3, lim, {});
      if (nWc && (nWc.end === lim || isP(T[nWc.end], ','))) { name('relative-what'); return { ja: 'いわゆる' + nWc.ja, end: nWc.end, clause: true }; }   // what is called a win-win situation → いわゆる…
      fail(m);
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
