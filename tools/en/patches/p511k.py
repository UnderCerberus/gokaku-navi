import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the harder it becomes for them to make a decision（形式主語 it の比例の後半に for A を許す → 人々にとって決断するのは…）
rep("""          let xI = k + 3;
          if (T[k + 2].w === 'will' && T[k + 3] && /^(?:be|become|get)$/.test(T[k + 3].w)) xI = k + 4;
          if (isW(T[xI], 'to') && xI + 1 < e) {
            const mI = mark();
            const infI = vpNonfin(xI + 1, e, 'base', {});
            if (infI && infI.end === e) { pick(k, aj.e); return { adj: en.jp.adj(aj.e.ja), subj: { ja: '', pron: 'it' }, become: true, past: /^(?:was|became|got)$/.test(T[k + 2].w), infGa: infI }; }
            fail(mI);
          }""",
    """          let xI = k + 3, forJ = '';
          if (T[k + 2].w === 'will' && T[k + 3] && /^(?:be|become|get)$/.test(T[k + 3].w)) xI = k + 4;
          if (isW(T[xI], 'for') && xI + 2 < e) { const mF = mark(); const nFi = np(xI + 1, e, { noRel: true, noCoord: true }); if (nFi && isW(T[nFi.end], 'to')) { forJ = (nFi.pron === 'them' ? '人々' : nFi.ja) + 'にとって'; xI = nFi.end; } else fail(mF); }
          if (isW(T[xI], 'to') && xI + 1 < e) {
            const mI = mark();
            const infI = vpNonfin(xI + 1, e, 'base', {});
            if (infI && infI.end === e) { pick(k, aj.e); return { adj: en.jp.adj(aj.e.ja), subj: { ja: '', pron: 'it' }, become: true, past: /^(?:was|became|got)$/.test(T[k + 2].w), infGa: infI, forJ: forJ }; }
            fail(mI);
          }""")
# p511j の adjHalf 側の追加は使われないので外す（同じ役目）
rep("""      if (isW(T[k], 'it') && T[k + 1] && T[k + 1].k === 'w' && (BE[T[k + 1].w] || /^(?:becomes|became|become|gets|got|grows|grew)$/.test(T[k + 1].w)) && k + 3 < e) {
        const mItH = mark();
        let xI = k + 2, forJ = '';
        if (isW(T[xI], 'for')) { const nFi = np(xI + 1, e, { noRel: true, noCoord: true }); if (nFi && isW(T[nFi.end], 'to')) { forJ = nFi.ja.replace(/^彼ら$/, '人々') + 'にとって'; xI = nFi.end; } }
        if (isW(T[xI], 'to') && xI + 1 < e) {
          const infI = vpNonfin(xI + 1, e, 'base', {});
          if (infI && infI.end === e) return { adj: aj, subj: null, become: !BE[T[k + 1].w], past: /^(?:was|were|became|got|grew)$/.test(T[k + 1].w), infGa: infI, forJ: forJ };
        }
        fail(mItH);
      }
""", "")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
