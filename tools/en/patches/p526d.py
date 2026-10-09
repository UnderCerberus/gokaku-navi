import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Ken prefers to stay indoors and read → 屋内にいて読書するほうを好む（3 単現の主語 + 現在の動詞 + to … and + 原形 は不定詞の並列。読んだ にしない）
rep("""          if (b - j <= 6 && !objR && T.slice(a + 1, je).some((t0) => t0.k === 'w' && (WH[t0.w] || t0.w === 'that' || t0.w === 'whether'))) {
            const mw = mark();
            const whole = clause(a, b, o);
            if (whole) return wrap(whole);
            fail(mw);
          }
          return wrap(joinCoord(w, left, rv));""",
    """          if (b - j <= 6 && !objR && T.slice(a + 1, je).some((t0) => t0.k === 'w' && (WH[t0.w] || t0.w === 'that' || t0.w === 'whether'))) {
            const mw = mark();
            const whole = clause(a, b, o);
            if (whole) return wrap(whole);
            fail(mw);
          }
          if (w === 'and' && !left.past && left.subj && !left.subj.pl && !left.subj.coord && !(left.subj.pron && /^(?:i|you|we|they)$/.test(left.subj.pron)) && T[rs] && T[rs].k === 'w' && !!vc(T[rs], ['base']) && !vc(T[rs], ['3sg']) && !MODAL[T[rs].w] && T.slice(a, je).some((x, q) => isW(x, 'to') && !!T[a + q + 1] && T[a + q + 1].k === 'w' && !!vc(T[a + q + 1], ['base']) && DET[T[a + q + 1].w] === undefined) && T.slice(a, je).some((x) => x.k === 'w' && !!vc(x, ['3sg']) && !x.cap)) {
            const mw2 = mark();
            const whole2 = clause(a, b, o);
            if (whole2) return wrap(whole2);
            fail(mw2);
          }
          return wrap(joinCoord(w, left, rv));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
