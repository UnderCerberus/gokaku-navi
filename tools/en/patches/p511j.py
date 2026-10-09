import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the harder it becomes for them to make a decision → 彼らにとって決断するのはますます難しくなる（形式主語 it + become / be + (for A) + to do）
rep("""    const adjHalf = (k, e, aj) => {
      // the less likely they are to fail（主語 + be + to 不定詞）""",
    """    const adjHalf = (k, e, aj) => {
      if (isW(T[k], 'it') && T[k + 1] && T[k + 1].k === 'w' && (BE[T[k + 1].w] || /^(?:becomes|became|become|gets|got|grows|grew)$/.test(T[k + 1].w)) && k + 3 < e) {
        const mItH = mark();
        let xI = k + 2, forJ = '';
        if (isW(T[xI], 'for')) { const nFi = np(xI + 1, e, { noRel: true, noCoord: true }); if (nFi && isW(T[nFi.end], 'to')) { forJ = nFi.ja.replace(/^彼ら$/, '人々') + 'にとって'; xI = nFi.end; } }
        if (isW(T[xI], 'to') && xI + 1 < e) {
          const infI = vpNonfin(xI + 1, e, 'base', {});
          if (infI && infI.end === e) return { adj: aj, subj: null, become: !BE[T[k + 1].w], past: /^(?:was|were|became|got|grew)$/.test(T[k + 1].w), infGa: infI, forJ: forJ };
        }
        fail(mItH);
      }
      // the less likely they are to fail（主語 + be + to 不定詞）""")
rep("""      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [vpJoin(h2.infGa, 'dict') + 'のが'] : [])).concat(['ますます']);""",
    """      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [(h2.forJ || '') + vpJoin(h2.infGa, 'dict') + 'のは'] : [])).concat(['ますます']);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
