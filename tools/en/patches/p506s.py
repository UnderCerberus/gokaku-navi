import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# he knew from an early age how dangerous the sea could be（動詞と間接疑問の間の前置詞句）
rep("""    const iw = ac0 && ac0.kind !== 'd' && i + 1 < lim && T[i + 1].k === 'w' && (WH[T[i + 1].w] || T[i + 1].w === 'whether') ? i + 1
      : (fx0 && fx0.end < lim && T[fx0.end].k === 'w' && (WH[T[fx0.end].w] || T[fx0.end].w === 'whether') ? fx0.end : i);""",
    """    const pp0 = WHV[L] && !ac0 && !(fx0 && fx0.end < lim && T[fx0.end].k === 'w' && (WH[T[fx0.end].w] || T[fx0.end].w === 'whether')) && t.k === 'w' && PREP[t.w] && t.w !== 'to' && i + 3 < lim ? (() => {
      const mP0 = mark();
      const r0 = parsePP(i, lim, { verbal: true, lemma: L });
      if (r0 && r0.ja && r0.end + 1 < lim && T[r0.end].k === 'w' && (WH[T[r0.end].w] || T[r0.end].w === 'whether')) return r0;
      fail(mP0); return null;
    })() : null;
    const iw = ac0 && ac0.kind !== 'd' && i + 1 < lim && T[i + 1].k === 'w' && (WH[T[i + 1].w] || T[i + 1].w === 'whether') ? i + 1
      : (fx0 && fx0.end < lim && T[fx0.end].k === 'w' && (WH[T[fx0.end].w] || T[fx0.end].w === 'whether') ? fx0.end : (pp0 ? pp0.end : i));""")
rep("""        if (iw > i) { if (ac0) addAdv(st, ac0, t.w); else { useIdiom(fx0.it); st.other.push(fx0.ja); } }""",
    """        if (iw > i) { if (ac0) addAdv(st, ac0, t.w); else if (pp0) { if (pp0.kind === 'time' || pp0.kind === 'dur') st.time.push(pp0.ja); else st.other.push(pp0.ja); } else { useIdiom(fx0.it); st.other.push(fx0.ja); } }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
