import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Each picture feels less like a record of a moment and more like a conversation with someone I miss
# → 瞬間の記録というより、…誰かとの会話のように感じられる（feel / look / sound / seem + less like A and more like B）
rep("""  function vpFrame(vg, i, lim, st, o) {
    const L = vg.lemma, t = T[i];
    if (!t || i >= lim || vg.passive) return null;
    const m = mark();
    let core = null;""",
    """  function vpFrame(vg, i, lim, st, o) {
    const L = vg.lemma, t = T[i];
    if (!t || i >= lim || vg.passive) return null;
    const m = mark();
    let core = null;
    if (/^(?:feel|look|sound|seem)$/.test(L) && seq(i, ['less', 'like']) && i + 3 < lim) {
      const kMl = T.findIndex((x, q) => q > i + 2 && q < lim - 2 && isW(x, 'and') && isW(T[q + 1], 'more') && isW(T[q + 2], 'like'));
      if (kMl > 0) {
        const nA = np(i + 2, kMl, {});
        const nB = nA && nA.end === kMl ? np(kMl + 3, lim, {}) : null;
        if (nA && nB && nB.end === lim) {
          name('comparative');
          const tlMl = L === 'feel' ? 'のように感じられる' : (L === 'look' ? 'のように見える' : (L === 'sound' ? 'のように聞こえる' : 'のように思える'));
          return done(vg, P(nA.ja + 'というより、' + nB.ja + tlMl, 'v1'), st, lim, 'SVC', o, [], { noStative: true });
        }
        fail(m);
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
