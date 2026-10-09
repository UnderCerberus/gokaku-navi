import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# online classes turned out to have some unexpected advantages → 予期しない利点があることが分かった（turn out to + be 以外の動詞。外に回った にしない）
rep("""  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;""",
    """  function vpIdiom(vg, i, lim, st, o) {
    const list = idiomIndex().verb[vg.lemma];
    if (!list) return null;
    if (vg.lemma === 'turn' && !vg.passive && seq(i, ['out', 'to']) && i + 2 < lim && T[i + 2].k === 'w' && !!vc(T[i + 2], ['base']) && !isW(T[i + 2], 'be')) {
      const mTo = mark();
      const iTo = vpNonfin(i + 2, lim, 'base', { subj: o.subj });
      if (iTo && verbal(iTo.pred)) { const rTo = done(vg, P(vpJoin(iTo, 'dict') + 'ことが分かる', 'v5'), st, iTo.end, 'SV', o, [], { noStative: true }); if (rTo) { name('idiom'); return rTo; } }
      fail(mTo);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
