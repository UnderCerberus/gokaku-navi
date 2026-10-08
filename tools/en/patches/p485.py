import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It dawned on me that … / It struck me that … / It never occurred to him to ask for help
rep("""    if (vg.lemma === 'occur' && !vg.passive && isW(T[j], 'to') && j + 2 < b) {
      const nOc = np(j + 1, b, { noRel: true, noCoord: true });
      if (nOc && isW(T[nOc.end], 'that') && nOc.end + 1 < b) {""",
    """    const kOc = vg.passive ? -1 : (vg.lemma === 'occur' && isW(T[j], 'to') ? j + 1 : (vg.lemma === 'dawn' && (isW(T[j], 'on') || isW(T[j], 'upon')) ? j + 1 : (vg.lemma === 'strike' && T[j] && T[j].k === 'w' && /^(?:me|him|her|us|them|you)$/.test(T[j].w) && isW(T[j + 1], 'that') ? j : -1)));
    if (kOc > 0 && kOc + 1 < b) {
      const nOc = np(kOc, b, { noRel: true, noCoord: true });
      const whoOc0 = nOc ? (nOc.pron ? ({ me: '私', us: '私たち', him: '彼', her: '彼女', them: '彼ら', you: 'あなた' })[nOc.pron] || nOc.ja : nOc.ja) : '';
      // It never occurred to him to ask for help → 彼は助けを求めることを思いつかなかった
      if (nOc && vg.lemma === 'occur' && isW(T[nOc.end], 'to') && nOc.end + 1 < b && vc(T[nOc.end + 1], ['base'])) {
        const viOc = vpNonfin(nOc.end + 1, b, 'base', {});
        if (viOc && viOc.end === b && verbal(viOc.pred)) { name('it-to'); return mkClause(null, done(vg, P('思いつく', 'v5'), st, b, 'SV', o, [whoOc0 + 'は' + vpJoin(viOc, 'dict') + 'ことを'], { noStative: true }), ''); }
      }
      if (nOc && isW(T[nOc.end], 'that') && nOc.end + 1 < b && vg.lemma !== 'occur') {
        const tcDw = thatClause(nOc.end, b, vg.past);
        if (tcDw) {
          name('it-that');
          const strDw = tcDw.str.replace(/だろう$/, '');
          if (vg.lemma === 'strike') return mkClause(null, done(vg, P('ふと思う', 'v5'), st, b, 'SV', o, [whoOc0 + 'は' + strDw + 'と'], { noStative: true }), '');
          return mkClause(null, done(vg, P('気づく', 'v5'), st, b, 'SV', o, [whoOc0 + 'は' + strDw + 'ことに'], { noStative: true }), '');
        }
      }
    }
    if (vg.lemma === 'occur' && !vg.passive && isW(T[j], 'to') && j + 2 < b) {
      const nOc = np(j + 1, b, { noRel: true, noCoord: true });
      if (nOc && isW(T[nOc.end], 'that') && nOc.end + 1 < b) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
