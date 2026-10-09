import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) did not V until X → Xになって初めてVした（否定 + until は「初めて」）
rep("""  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;""",
    """  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      if (isW(T[j0], 'until') && vg && (vg.neg || st.neg) && !vg.modal && !vg.perfect && !vg.passive && j0 + 1 < lim && !isP(T[j0 - 1], ',')) {
        const mUn = mark();
        const ppUn = parsePP(j0, lim, {});
        if (ppUn && ppUn.end === lim && /まで$/.test(ppUn.ja)) { vg.neg = false; st.neg = false; st.time.push(ppUn.ja.replace(/まで$/, '') + (/(?:後|前|時|頃|日|年|月|週|時間|分|夜中|世紀)$/.test(ppUn.ja.replace(/まで$/, '')) ? 'になって初めて' : 'になって初めて')); j = ppUn.end; continue; }   // did not become famous until after his death → 死後になって初めて有名になった
        fail(mUn);
      }""")

# 2) I hardly recognized it → ほとんど分からなかった（recognize + 物・場所・人の代名詞 → 分かる）
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'recognize|it him her them place town village city face faces voice voices|が|分かる', 'miss|connection connections|に|乗り遅れる',""")

# 3) …, according to one study → ある研究によれば、…（文末の according to は文全体にかける）
rep("""    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""",
    """    {
      const kAc = T.findIndex((x, q) => q > 2 && q < b - 2 && isP(x, ',') && seq(q + 1, ['according', 'to']));
      if (kAc > 0 && !tokens.__accSplit) {
        const mAc = mark();
        const nAc = np(kAc + 3, b, { noRel: true });
        if (nAc && nAc.end === b) {
          const endAc = Object.assign({}, tokens[b] || tokens[b - 1], { s: '.', w: '.', k: 'p' });
          const tAc = tokens.slice(0, kAc).concat([endAc]);
          tAc.__accSplit = true;
          const nAcJa = nAc.ja.replace(/^1つの/, 'ある');
          const rAc = translate1(tAc);
          reset(tokens);
          if (rAc && rAc.ok) return Object.assign({}, rAc, { ja: nAcJa + 'によれば、' + rAc.ja });
        } else fail(mAc);
      }
    }
    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""")

# 4) every season → 季節ごとに（時の句）
rep("""    'next time': '次回', 'the next time': '次回は', 'this year': '今年',""",
    """    'next time': '次回', 'the next time': '次回は', 'every season': '季節ごとに', 'every semester': '学期ごとに', 'every term': '学期ごとに', 'this year': '今年',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
