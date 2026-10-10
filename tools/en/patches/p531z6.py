import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# He was so moved that he cried（so … that は結果。感動の that 節にしない）
rep("""      if (T[iMv] && /^(?:moved|touched)$/.test(T[iMv].w || '') && isW(T[iMv + 1], 'that') && iMv + 2 < lim && !vg.neg) {""",
    """      if (T[iMv] && /^(?:moved|touched)$/.test(T[iMv].w || '') && isW(T[iMv + 1], 'that') && iMv + 2 < lim && !vg.neg && !T.slice(i, iMv).some((x) => isW(x, 'so') || isW(x, 'such'))) {""")

# I was deeply moved that a stranger had … / I was touched that she remembered my name（受け身の be moved / touched + that 節 → 〜ことに感動した）
rep("""  function vpPassiveInf(vg, i, lim, st, o) {
""",
    """  function vpPassiveInf(vg, i, lim, st, o) {
    if (vg.passive && /^(?:move|touch)$/.test(vg.lemma) && isW(T[i], 'that') && i + 2 < lim && !(o.subj && o.subj.pron === 'it')) {
      const mMv = mark();
      const cMv = sentence(i + 1, lim, { sub: true });
      if (cMv) { name('that-clause'); return done(Object.assign({}, vg, { passive: false }), P('感動する', 'suru'), st, lim, 'SV', o, [cMv.out({ part: 'が' }) + 'ことに'], { noStative: true }); }
      fail(mMv);
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
