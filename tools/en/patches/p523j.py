import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The success of the project was due not so much to luck as to the careful planning of the team → 運というよりむしろチームの注意深い計画によるものだった
rep("""    // not so much A as B（A というよりむしろ B）
    if (vg.neg && seq(i, ['so', 'much']) && i + 3 < lim) {""",
    """    if (!vg.neg && isW(T[i], 'due') && seq(i + 1, ['not', 'so', 'much', 'to']) && i + 7 < lim) {
      const mDn = mark();
      const nAd = np(i + 5, lim, { noRel: true, noCoord: true });
      const nBd = nAd && seq(nAd.end, ['as', 'to']) && nAd.end + 2 < lim ? np(nAd.end + 2, lim, {}) : null;
      if (nBd && nBd.end === lim) { name('not-so-much'); return fin(P(nAd.ja + 'というよりむしろ' + nBd.ja + 'によるものだ', 'da'), lim); }   // due not so much to luck as to …
      fail(mDn);
    }
    // not so much A as B（A というよりむしろ B）
    if (vg.neg && seq(i, ['so', 'much']) && i + 3 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
