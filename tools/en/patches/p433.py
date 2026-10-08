import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""      // It is not the technology itself but the way we use it that …（not A but B の but は節の分割点ではない: 単文を先に試す）
""",
    """      // Studies show that a combination of diet and exercise is … → that 節の主語の名詞句の中の and（that + 名詞句 … A and B + 動詞）は単文を先に試す
      if (isCC && w === 'and' && je === j && T[j - 1].k === 'w' && !!nounC(T[j - 1]) && T[rs] && T[rs].k === 'w' && !!nounC(T[rs]) && !(PRON[T[rs].w] && PRON[T[rs].w].sub) &&
        T.slice(a, j).some((x, q) => isW(x, 'that') && a + q - 1 >= a && T[a + q - 1].k === 'w' && (() => { const vv = vc(T[a + q - 1], ['base', '3sg', 'past']); return !!vv && (SAYV[vv.lemma] || THINKV[vv.lemma] || /^(?:show|suggest|find|indicate|reveal|prove|mean|know|realize|notice|learn|discover|hope|fear|understand|confirm)$/.test(vv.lemma)); })() && !T.slice(a + q + 1, j).some((y) => y.k === 'w' && (!!vc(y, ['3sg', 'past']) && !nounC(y) || MODAL[y.w] || BE[y.w])))) {
        const mTs = mark();
        const wholeTs = clause(a, b, o);
        if (wholeTs) return wrap(wholeTs);
        fail(mTs);
      }
      // It is not the technology itself but the way we use it that …（not A but B の but は節の分割点ではない: 単文を先に試す）
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
