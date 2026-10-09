import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Small changes in our daily habits, if many people make them, can have a big impact → 多くの人々がそれらを行えば、私たちの日々の習慣の小さな変化は大きな影響を持ちうる
# （主語の名詞句と動詞の間に挟まった , if / when / although … , の節は文頭に出して読む）
rep("""    {
      const kIo = T.findIndex((x, q) => q > 3 && q < b - 3 && isP(x, ',') && /^(?:or|and)$/.test((T[q + 1] || {}).w || '')""",
    """    if (!tokens.__insSplit) {
      const kIs = T.findIndex((x, q) => q > 1 && q < b - 4 && isP(x, ',') && /^(?:if|when|although|though|because|once|unless|while)$/.test((T[q + 1] || {}).w || ''));
      let kIs2 = -1;
      if (kIs > 0) for (let x = kIs + 3; x < b - 1; x++) if (isP(T[x], ',')) { kIs2 = x; break; }
      if (kIs > 0 && kIs2 > 0 && T[kIs + 2] && T[kIs + 2].k === 'w' && ((PRON[T[kIs + 2].w] && PRON[T[kIs + 2].w].sub) || DET[T[kIs + 2].w] !== undefined || (!!nounC(T[kIs + 2]) && !vc(T[kIs + 2], ['pp', 'ing']))) && T[kIs2 + 1] && T[kIs2 + 1].k === 'w' && (!!MODAL[T[kIs2 + 1].w] || !!BE[T[kIs2 + 1].w] || !!HAVE[T[kIs2 + 1].w] || (!!vc(T[kIs2 + 1], ['3sg', 'past', 'base']) && !nounC(T[kIs2 + 1]) && DET[T[kIs2 + 1].w] === undefined && !PRON[T[kIs2 + 1].w]))) {
        const mIs = mark();
        const sIs = np(0, kIs, {});
        fail(mIs);
        if (sIs && sIs.end === kIs && !sIs.pron) {
          const tIs = tokens.slice(kIs + 1, kIs2 + 1).concat(tokens.slice(0, kIs), tokens.slice(kIs2 + 1));
          tIs.__insSplit = true;
          const rIs = translate1(tIs);
          reset(tokens);
          if (rIs && rIs.ok) return rIs;
        }
      }
    }
    {
      const kIo = T.findIndex((x, q) => q > 3 && q < b - 3 && isP(x, ',') && /^(?:or|and)$/.test((T[q + 1] || {}).w || '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
