import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I soon realized how much there was to remember / how much work there was to do → 覚えることがどれだけあったか・するべき仕事がどれだけあったか（how much / many (+ 名詞) + there be + to 不定詞）
rep("""  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();""",
    """  function whClause(j, lim) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return null;
    const m = mark();
    if (t.w === 'how' && T[j + 1] && /^(?:much|many)$/.test(T[j + 1].w || '') && j + 5 < lim + 1) {
      let kH = j + 2, nH = null;
      if (!isW(T[kH], 'there')) { nH = np1(kH, lim, { noRel: true, noPost: true }); if (nH) kH = nH.end; }
      if (isW(T[kH], 'there') && T[kH + 1] && T[kH + 1].k === 'w' && BE[T[kH + 1].w] && isW(T[kH + 2], 'to') && T[kH + 3] && T[kH + 3].k === 'w' && !!vc(T[kH + 3], ['base'])) {
        const infH = vpNonfin(kH + 3, lim, 'base', { gap: { type: 'np', rel: true, used: false } });
        if (infH && infH.end === lim) {
          name('indirect-q');
          const pastH = /^(?:was|were)$/.test(T[kH + 1].w);
          return { str: vpJoin(infH, 'dict') + (nH ? nH.ja : 'こと') + 'がどれだけ' + (pastH ? 'あった' : 'ある') + 'か', end: lim };
        }
      }
      fail(m);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
