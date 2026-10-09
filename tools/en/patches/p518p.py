import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I had hardly gone to bed when the phone rang → 寝るか寝ないかのうちに（過去分詞だけの形 gone / begun は原形に戻して節を読む）
rep("""      const mH = mark();
      const tH = T.slice(a, x).concat(T.slice(x + 2, w));
      const c1 = withTokens(tH, () => clause(0, tH.length, {}));""",
    """      const mH = mark();
      const ppH = T[x + 2] && T[x + 2].k === 'w' ? vc(T[x + 2], ['pp']) : null;
      const onlyPpH = !!ppH && !vc(T[x + 2], ['past']);
      const tH = T.slice(a, x).concat(onlyPpH ? [Object.assign({}, T[x + 2], { w: ppH.lemma, s: ppH.lemma })] : [T[x + 2]], T.slice(x + 3, w));
      let c1 = null;
      NO_AGREE = onlyPpH;
      try { c1 = withTokens(tH, () => clause(0, tH.length, {})); } finally { NO_AGREE = false; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
