import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Rather than punishing students for their mistakes, good teachers … → 生徒を間違いのことで罰するのではなく、良い先生は…
#（文頭の rather than を前置きの句として読む。動名詞が続くときも 〜のではなく）
rep("""        if (vR) return { ja: adR + vpJoin(vR, 'dict') + 'のではなく', adn: adR + vpJoin(vR, 'dict') + 'のではない', end: vR.end, kind: 'other', prep: 'rather than', obj: null };
        fail(mR);
      }
    }""",
    """        if (vR) return { ja: adR + vpJoin(vR, 'dict') + 'のではなく', adn: adR + vpJoin(vR, 'dict') + 'のではない', end: vR.end, kind: 'other', prep: 'rather than', obj: null };
        fail(mR);
      }
      if (kR < lim && ingVerb(kR, lim)) {
        const mRg = mark();
        const vRg = vpNonfin(kR, lim, 'ing', {});
        if (vRg && verbal(vRg.pred) && (vRg.end >= lim || T[vRg.end].k === 'p' || T[vRg.end].k === 'w')) return { ja: adR + vpJoin(vRg, 'dict') + 'のではなく', adn: adR + vpJoin(vRg, 'dict') + 'のではない', end: vRg.end, kind: 'other', prep: 'rather than', obj: null };   // rather than punishing students → 生徒を罰するのではなく
        fail(mRg);
      }
    }""")
rep("""      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a)) && T[a].w !== 'to') {
        const m0 = mark();
        let pp = parsePP(a, b, { noRel: true, noCoord: true });""",
    """      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than'])) && T[a].w !== 'to') {
        const m0 = mark();
        let pp = parsePP(a, b, { noRel: true, noCoord: true });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
