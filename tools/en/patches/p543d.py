import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# animals that are not usually thought of as intelligent → ふつう知能が高いとは考えられていない動物 / He is thought of as a hero → 英雄だと考えられている
# （think of A as B の受け身 be thought of as + 形容詞・名詞は「〜と考えられる」）
rep("""  function vpIdiom(vg, i, lim, st, o) {
""",
    """  function vpIdiom(vg, i, lim, st, o) {
    if (vg.passive && /^(?:think|regard|consider)$/.test(vg.lemma) && (vg.lemma === 'think' ? seq(i, ['of', 'as']) : isW(T[i], 'as')) && !st.agent) {
      const kTa = vg.lemma === 'think' ? i + 2 : i + 1;
      const mTa = mark();
      const aTa = kTa < lim ? adjC(T[kTa]) : null;
      let cTa = null, eTa = -1;
      if (aTa && aTa.e && !(T[kTa + 1] && T[kTa + 1].k === 'w' && !!nounC(T[kTa + 1]) && !PREP[T[kTa + 1].w])) { const fTa = en.jp.adj(aTa.e.ja); cTa = fTa.pred.plain().replace(/の(高い|低い|強い|弱い|多い|少ない|大きい|小さい|ある|ない)$/, 'が$1'); eTa = kTa + 1; pick(kTa, aTa.e); }
      else { const nTa = kTa < lim ? np(kTa, lim, { noRel: true }) : null; if (nTa) { cTa = nTa.ja + 'だ'; eTa = nTa.end; } }
      if (cTa) {
        const eT2 = tail(eTa, lim, st, o, vg);
        if (eT2 === lim) {
          name('passive');
          return done(vg, P(cTa + (vg.neg ? 'とは' : 'と') + (vg.lemma === 'think' ? '考える' : 'みなす'), vg.lemma === 'think' ? 'v1' : 'v5'), st, lim, 'SV', o, [], { noStative: true });
        }
      }
      fail(mTa);
    }
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
