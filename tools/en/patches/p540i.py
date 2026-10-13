import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it can gradually be made longer or more difficult → 徐々により長く、またはより難しくされうる / The rules were made clear → 規則は明確にされた
# （make の受け身 + 形容詞（比較級・more + 形容詞・or / and の並列も）は「〜くされる・〜にされる」。「もっと長く作れる」にしない）
rep("""  function vpGeneric(vg, i, lim, st, o) {
""",
    """  function vpGeneric(vg, i, lim, st, o) {
    if (vg.passive && vg.lemma === 'make' && i < lim && T[i].k === 'w' && !st.agent) {
      const adjPh = (k) => {
        let pre = '';
        if (isW(T[k], 'more') && adjC(T[k + 1]) && adjC(T[k + 1]).form === 'base') { pre = 'より'; k++; }
        const a = adjC(T[k]);
        if (!a || !a.e || nounC(T[k]) && !ADJ_OK[T[k].w] && !a.form) return null;
        if (T[k + 1] && T[k + 1].k === 'w' && !!nounC(T[k + 1]) && !PREP[T[k + 1].w] && !/^(?:or|and|than|enough)$/.test(T[k + 1].w)) return null;
        const f = en.jp.adj(a.e.ja);
        if (!f || !f.adv || !(f.kind === 'i' || f.kind === 'na')) return null;
        return { ja: (a.form === 'comp' ? 'より' : pre) + f.adv, end: k + 1, a: a, k: k };
      };
      const aM1 = adjPh(i);
      if (aM1) {
        const aM2 = aM1.end + 1 < lim && /^(?:or|and)$/.test(T[aM1.end].w || '') ? adjPh(aM1.end + 1) : null;
        const eAm = aM2 ? aM2.end : aM1.end;
        if (!isW(T[eAm], 'than') && !isW(T[eAm], 'to') && !isW(T[eAm], 'for')) {
          const mMa = mark();
          const eTm = tail(eAm, lim, st, o, vg);
          if (eTm === lim) {
            pick(aM1.k, aM1.a.e); if (aM2) pick(aM2.k, aM2.a.e);
            name('passive');
            const advM = aM2 ? aM1.ja + (T[aM1.end].w === 'or' ? '、または' : '、') + aM2.ja : aM1.ja;
            return done(vg, P(advM + 'する', 'suru'), st, lim, 'SV', o, [], { noStative: true });
          }
          fail(mMa);
        }
      }
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
