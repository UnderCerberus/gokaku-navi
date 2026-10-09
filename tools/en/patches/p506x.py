import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 形容詞のあとの前置詞句（too dependent on it to … / too busy with work to …）: dependent / reliant + on → 〜に
rep("""  function npNext(x) {""",
    """  function adjPPs(k, lim, aLemma) {
    let e = k, ja = '';
    while (e < lim && T[e].k === 'w' && PREP[T[e].w] && !/^(?:to|for|than|as)$/.test(T[e].w)) {
      const pp = parsePP(e, lim, { noCoord: true });
      if (!pp || !pp.ja) break;
      ja += /^(?:on|upon)$/.test(pp.prep || T[e].w) && /^(?:dependent|reliant)$/.test(aLemma || '') && pp.obj ? pp.obj.ja + 'に' : pp.ja;
      e = pp.end;
    }
    return { ja: ja, end: e };
  }
  function npNext(x) {""")

# be too ADJ (+ 前置詞句) (for A) to do: He is too dependent on his parents to live alone → 両親にあまりに頼っていて一人で暮らせない
rep("""    if (isW(t, 'too') && j + 3 < lim) {
      const a2 = adjC(T[j + 1]);
      if (a2) {
        const ft = forTo(j + 2, lim);""",
    """    if (isW(t, 'too') && j + 3 < lim) {
      const a2 = adjC(T[j + 1]);
      if (a2) {
        const ppA2 = adjPPs(j + 2, lim, a2.lemma);
        const ft = forTo(ppA2.end, lim);""")
rep("""            const rTt = fin(pCan, inf.end, 'SVC', [(ft.np ? ft.np.ja + 'には' : '') + pre].concat(inf.parts.map((x) => x.replace(/^何かを$/, '何も'))));""",
    """            const rTt = fin(pCan, inf.end, 'SVC', [(ft.np ? ft.np.ja + 'には' : '') + ppA2.ja + pre].concat(inf.parts.map((x) => x.replace(/^何かを$/, '何も'))));""")

# become / get too ADJ (+ 前置詞句) to do → 〜すぎて…できなくなる（He became too tired to walk → 疲れすぎて歩けなくなった。これまで「ようになた」と活用が壊れていた）
rep("""      if (isW(T[i], 'too') && i + 3 < lim && adjC(T[i + 1]) && isW(T[i + 2], 'to') && vc(T[i + 3], ['base']) && /^(?:seem|appear|look|sound|become|get)$/.test(L)) {
        const mt = mark(), a8 = adjC(T[i + 1]);
        const inf8 = vpNonfin(i + 3, lim, 'base', {});
        if (inf8) {
          pick(i + 1, a8.e);
          const f8 = en.jp.adj(a8.e.ja);""",
    """      const ppA8 = isW(T[i], 'too') && i + 3 < lim && adjC(T[i + 1]) ? adjPPs(i + 2, lim, adjC(T[i + 1]).lemma) : { ja: '', end: i + 2 };
      if (isW(T[i], 'too') && ppA8.end + 1 < lim && adjC(T[i + 1]) && isW(T[ppA8.end], 'to') && vc(T[ppA8.end + 1], ['base']) && /^(?:seem|appear|look|sound|become|get|grow)$/.test(L)) {
        const mt = mark(), a8 = adjC(T[i + 1]);
        const inf8 = vpNonfin(ppA8.end + 1, lim, 'base', { subj: o.subj });
        if (inf8 && /^(?:become|get|grow)$/.test(L) && verbal(inf8.pred)) {
          pick(i + 1, a8.e);
          const f8b = en.jp.adj(a8.e.ja);
          const preB = f8b.stem !== null && (f8b.kind === 'i' || f8b.kind === 'na') ? f8b.stem + 'すぎて' : 'あまりに' + f8b.te;
          name('too-to');
          return done(vg, P(ppA8.ja + preB + inf8.parts.join('') + inf8.pred.aux('can').aux('neg').plain().replace(/ない$/, 'なくなる'), 'v5'), st, tail(inf8.end, lim, st, o, vg), 'SVC', o, [], { noStative: true });
        }
        if (inf8 && ppA8.end === i + 2) {
          pick(i + 1, a8.e);
          const f8 = en.jp.adj(a8.e.ja);""")

# think for themselves → 自分で考える（for + 再帰代名詞 + 考える・決める など）
rep("""      case 'for':
        if (obj.num && obj.num.val && /^(?:night|nights)$/.test(obj.head || '')) return R(obj.num.ja + '泊で', 'other', obj.num.ja + '泊の');""",
    """      case 'for':
        if (o && /^(?:think|decide|judge|see|choose|learn|discover|speak|figure|find|check|read|study|work)$/.test(o.lemma || '') && /^(?:myself|yourself|himself|herself|itself|ourselves|yourselves|themselves|oneself)$/.test(obj.pron || obj.head || '')) return R('自分で', 'other', '自分での');   // think for themselves → 自分で考える
        if (obj.num && obj.num.val && /^(?:night|nights)$/.test(obj.head || '')) return R(obj.num.ja + '泊で', 'other', obj.num.ja + '泊の');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
