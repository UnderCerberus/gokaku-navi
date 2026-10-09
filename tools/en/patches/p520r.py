import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 疑問詞節の後ろの時・条件の節は疑問詞節の中で読む:
#  … was not the size of the effect but how quickly it disappeared once the program ended → プログラムが終わるとそれがどのくらい速く消えたか
#  He explained why the bridge collapsed when the earthquake hit → 地震が起きたとき橋がなぜ崩壊したか説明した
rep("""    let cl2 = clause(wh.end, lim, { gap: gap, sub: true });
    // how hard you work / how fast he runs""",
    """    if (WH_SUBIN && lim - wh.end >= 4) {   // 中の従属節で分けるのを先に試す（disappeared once the program ended を 1 つの節にしない）
      for (let k = wh.end + 2; k < lim - 1; k++) {
        const sK = subAt(k, lim);
        if (!sK || !/^(?:when|once|after|before|until|as soon as|if|whenever|the moment)$/.test(sK.key) || isP(T[k - 1], ',')) continue;
        fail(m);
        gap.used = false;
        const cK = clause(wh.end, k, { gap: gap, sub: true });
        const scK = cK && gap.used ? sentence(k + sK.len, lim, { sub: true }) : null;
        if (cK && scK) { name('indirect-q'); return { str: subStr(sK.key, scK, cK, null).replace(/、$/, '') + (cK.out({ part: 'が', form: 'attr' }).replace(/だろう$/, '') + 'か').replace(/([^んこそあど])なか$/, '$1か'), end: lim }; }
        fail(m);
        gap.used = false;
        break;
      }
    }
    let cl2 = clause(wh.end, lim, { gap: gap, sub: true });
    // how hard you work / how fast he runs""")
rep("""  let WH_MAINPAST = false;
""",
    """  let WH_MAINPAST = false;
  let WH_SUBIN = false;   // 疑問詞節の中に後ろの従属節を入れて読む（sentence の 3) から試す）
""")
rep("""      const m4 = mark();
      const espS = pv.k === 'w' && /^(?:especially|particularly)$/.test(pv.w) && isP(T[j - 2], ',') && j - 2 > a + 1;""",
    """      const m4 = mark();
      // 動詞・be + 疑問詞節 + 時・条件の節（コンマなし）: 疑問詞節の中に入れて読むのを先に試す
      if (!WH_SUBIN && !isP(pv, ',') && /^(?:when|once|after|before|until|as soon as|if|whenever|the moment)$/.test(s2.key) && T.slice(a + 1, j - 2).some((x, q) => x.k === 'w' && /^(?:what|how|why|where|who|which|whether)$/.test(x.w) && T[a + q].k === 'w' && (!!BE[T[a + q].w] || isW(T[a + q], 'but') || (() => { const vW = vc(T[a + q], ['base', '3sg', 'past', 'pp', 'ing']); return !!vW && !!WHV[vW.lemma]; })() || (PRON[T[a + q].w] && !PRON[T[a + q].w].sub && a + q - 1 >= a && (() => { const vW2 = vc(T[a + q - 1], ['base', '3sg', 'past', 'pp', 'ing']); return !!vW2 && !!WHV[vW2.lemma]; })())) && !T.slice(a + q + 2, j).some((y) => isP(y, ',')))) {
        WH_SUBIN = true;
        let wholeW = null;
        try { wholeW = clause(a, b, o); } finally { WH_SUBIN = false; }
        if (wholeW) return wrap(wholeW);
        fail(m4);
      }
      const espS = pv.k === 'w' && /^(?:especially|particularly)$/.test(pv.w) && isP(T[j - 2], ',') && j - 2 > a + 1;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
