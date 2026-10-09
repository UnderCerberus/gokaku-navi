import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the more interested I became in its people → その人々にますます興味を持つようになった（後半の 主語 + become + 前置詞句）
rep("""      const last = T[e - 1];
      const bv = k < e - 1 && last && last.k === 'w' && !BE[last.w] ? vc(last, ['base', '3sg', 'past']) : null;""",
    """      for (let x = k + 1; x < e - 1; x++) {
        if (!(T[x].k === 'w' && /^(?:became|become|becomes|get|gets|got|grew|grow|grows|is|was|are|were|am)$/.test(T[x].w) && T[x + 1].k === 'w' && PREP[T[x + 1].w])) continue;
        const mPx = mark();
        const sjP = subject(k, x);
        const ppX = sjP && sjP.end === x ? parsePP(x + 1, e, {}) : null;
        if (ppX && ppX.end === e) {
          const isBeP = !!BE[T[x].w];
          if (!isBeP) { const bvP = vc(T[x], ['base', '3sg', 'past']); if (bvP) pick(x, bvP.e); }
          const ppJaP = isW(T[x + 1], 'in') && /興味/.test(aj.pred.plain()) && ppX.obj ? ppX.obj.ja + 'に' : ppX.ja;
          return { adj: aj, subj: sjP, become: !isBeP, past: /^(?:became|got|grew|was|were)$/.test(T[x].w), ppJa: ppJaP };   // the more interested I became in its people
        }
        fail(mPx);
      }
      const last = T[e - 1];
      const bv = k < e - 1 && last && last.k === 'w' && !BE[last.w] ? vc(last, ['base', '3sg', 'past']) : null;""")
rep("""      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [(h2.forJ || '') + vpJoin(h2.infGa, 'dict') + 'のが'] : [])).concat(['ますます']);""",
    """      const parts = (h2.inf ? [vpJoin(h2.inf, 'dict') + 'には'] : (h2.infGa ? [(h2.forJ || '') + vpJoin(h2.infGa, 'dict') + 'のが'] : [])).concat(h2.ppJa ? [h2.ppJa] : []).concat(['ますます']);""")
rep("""      const becomeV = (aj) => (aj.kind === 'v' ? P(/自信がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/自信がある$/, '自信がつく') : aj.pred.plain() + 'ようになる', 'v5') :""",
    """      const becomeV = (aj) => (aj.kind === 'v' ? P(/自信がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/自信がある$/, '自信がつく') : (/興味がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/興味がある$/, '興味を持つようになる') : aj.pred.plain() + 'ようになる'), 'v5') :""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
