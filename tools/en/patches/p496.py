import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) would never have finished / could hardly have imagined（法助動詞と完了の have の間の副詞）
rep("""        if (advs.length && k < lim && isW(T[k], 'be')) { advs.forEach((x) => vg.advs.push(x)); j = k + 1; return beTail(); }
      }""",
    """        if (advs.length && k < lim && isW(T[k], 'be')) { advs.forEach((x) => vg.advs.push(x)); j = k + 1; return beTail(); }
        // would never have finished / could hardly have imagined（法助動詞と完了の have の間の副詞 → 下の完了の have へ）
        if (advs.length && k + 1 < lim && isW(T[k], 'have') && (isW(T[k + 1], 'been') || !!vc(T[k + 1], ['pp']))) { advs.forEach((x) => vg.advs.push(x)); j = k; }
      }""")

# 2) be better able to / be more able to（比較級 + able to）
rep("""      if (seq(j, ['able', 'to']) && j + 2 < lim && vc(T[j + 2], ['base'])) { vg.semi = 'able'; j += 2; return baseVerb(); }""",
    """      if (seq(j, ['able', 'to']) && j + 2 < lim && vc(T[j + 2], ['base'])) { vg.semi = 'able'; j += 2; return baseVerb(); }
      // are better able to understand → よりよく理解できる / more able to → もっと〜できる / less able to → あまり〜できない
      if (j + 3 < lim && /^(?:better|more|less)$/.test(T[j].w || '') && seq(j + 1, ['able', 'to']) && vc(T[j + 3], ['base'])) {
        if (T[j].w === 'less') vg.neg = true;
        vg.advs.push({ a: { ja: T[j].w === 'better' ? 'よりよく' : (T[j].w === 'more' ? 'もっと' : 'あまり'), kind: 'm', e: null }, w: T[j].w });
        vg.semi = 'able'; j += 3; return baseVerb();
      }""")

# 3) be very badly injured / extremely well organized（程度の副詞 + -ly の副詞 + 形容詞）
rep("""      while (k < lim - 1 && T[k].k === 'w' && ADV[T[k].w] && ADV[T[k].w][1] === 'd' && T[k].w !== 'so' && T[k].w !== 'too' &&
        (adjC(T[k + 1]) || isW(T[k + 1], 'more') || isW(T[k + 1], 'less') || (ADV[T[k + 1].w] && ADV[T[k + 1].w][1] === 'd'))) { deg += ADV[T[k].w][0]; k++; }""",
    """      const lyAdj = (q) => q + 1 < lim && T[q].k === 'w' && /ly$/.test(T[q].w) && !ADV[T[q].w] && !adjC(T[q]) && !!advC(T[q]) && !!adjC(T[q + 1]);
      while (k < lim - 1 && T[k].k === 'w' && ADV[T[k].w] && ADV[T[k].w][1] === 'd' && T[k].w !== 'so' && T[k].w !== 'too' &&
        (adjC(T[k + 1]) || isW(T[k + 1], 'more') || isW(T[k + 1], 'less') || (ADV[T[k + 1].w] && ADV[T[k + 1].w][1] === 'd') || lyAdj(k + 1))) { deg += ADV[T[k].w][0]; k++; }
      if (deg && lyAdj(k)) { const avL = advC(T[k]); pick(k, avL.e); deg += avL.ja; k++; }   // very badly injured → とてもひどくけがをした""")

# 4) so badly damaged that … / so seriously injured that …（so + -ly の副詞 + 形容詞・過去分詞 + that）
rep("""    if (isW(t, 'so') && j + 3 < lim) {
      const a1 = adjC(T[j + 1]);
      const pc1 = vc(T[j + 1], ['pp']);""",
    """    if (isW(t, 'so') && j + 3 < lim) {
      // so badly damaged that …: so と形容詞・過去分詞の間の -ly の副詞（ひどく）
      const lyS = j + 2 < lim && T[j + 1].k === 'w' && /ly$/.test(T[j + 1].w) && !ADV[T[j + 1].w] && !adjC(T[j + 1]) && !!advC(T[j + 1]) && (!!adjC(T[j + 2]) || !!vc(T[j + 2], ['pp'])) ? advC(T[j + 1]) : null;
      const q1 = lyS ? j + 2 : j + 1;
      if (lyS) pick(j + 1, lyS.e);
      const a1 = adjC(T[q1]);
      const pc1 = vc(T[q1], ['pp']);""")
rep("""      if ((a1 && T[j + 2].k === 'w' && PREP[T[j + 2].w]) || (pc1 && !a1)) {
        for (let th = j + 2; th < lim - 1; th++) {""",
    """      if ((a1 && T[q1 + 1].k === 'w' && PREP[T[q1 + 1].w]) || (pc1 && !a1)) {
        for (let th = q1 + 1; th < lim - 1; th++) {""")
rep("""            const vgP = Object.assign({}, vg, { passive: true, lemma: pc1.lemma, e: pc1.e, idx: j + 1, end: j + 2, form: 'pp', advs: [] });
            r0 = parseVP(vgP, j + 2, th, o);
          }
          const clT = r0 && r0.end === th ? sentence(th + 1, lim, { sub: true }) : null;
          if (r0 && clT) {
            name('so-that');
            const omitT = sj && sj.pron ? sj.pron : (sj && !sj.an && !sj.pl && clT.subj && clT.subj.pron === 'it' ? 'it' : null);
            r0.pred = P('とても' + r0.pred.s, r0.pred.cls);                                     // 自分の仕事でとても忙しかったので""",
    """            const vgP = Object.assign({}, vg, { passive: true, lemma: pc1.lemma, e: pc1.e, idx: q1, end: q1 + 1, form: 'pp', advs: [] });
            r0 = parseVP(vgP, q1 + 1, th, o);
            if (r0 && lyS) r0.lySo = lyS.ja;
          }
          const clT = r0 && r0.end === th ? sentence(th + 1, lim, { sub: true }) : null;
          if (r0 && clT) {
            name('so-that');
            const omitT = sj && sj.pron ? sj.pron : (sj && !sj.an && !sj.pl && clT.subj && clT.subj.pron === 'it' ? 'it' : null);
            r0.pred = P('とても' + (r0.lySo || '') + r0.pred.s, r0.pred.cls);                                     // 自分の仕事でとても忙しかったので / 地震でとてもひどく被害を受けたので""")
rep("""      if (a1 && isW(T[j + 2], 'that')) {
        const cl = sentence(j + 3, lim, { sub: true });
        if (cl) {
          name('so-that'); pick(j + 1, a1.e);
          const f1 = en.jp.adj(a1.e.ja);
          const r1 = fin(P('とても' + f1.pred.s, f1.pred.cls), lim);""",
    """      if (a1 && isW(T[q1 + 1], 'that')) {
        const cl = sentence(q1 + 2, lim, { sub: true });
        if (cl) {
          name('so-that'); pick(q1, a1.e);
          const f1 = en.jp.adj(a1.e.ja);
          const r1 = fin(P('とても' + (lyS ? lyS.ja : '') + f1.pred.s, f1.pred.cls), lim);""")

# 5) the more confident you will become（後半: 形容詞 + 主語 + 助動詞 + become / get / grow）
rep("""      const last = T[e - 1];
      const bv = k < e - 1 && last && last.k === 'w' && !BE[last.w] ? vc(last, ['base', '3sg', 'past']) : null;""",
    """      // the more confident you will become → ますます自信がつくだろう（主語 + 助動詞 + become / get / grow）
      if (e - 2 > k && T[e - 2].k === 'w' && MODAL[T[e - 2].w] && /^(?:become|get|grow)$/.test(T[e - 1].w || '')) {
        const mB = mark();
        const sjB = subject(k, e - 2);
        const bB = vc(T[e - 1], ['base']);
        if (sjB && sjB.end === e - 2 && bB) { pick(e - 1, bB.e); return { adj: aj, subj: sjB, become: true, past: false, modal: T[e - 2].w }; }
        fail(mB);
      }
      const last = T[e - 1];
      const bv = k < e - 1 && last && last.k === 'w' && !BE[last.w] ? vc(last, ['base', '3sg', 'past']) : null;""")
# 「自信がある」などの動詞型の形容詞 + なる → 自信がつく／〜あるようになる（自信があってなる にしない）
rep("""      let pr = h2.less ? (h2.become ? P(h2.adj.adv.replace(/に$/, '') + 'でなくなる', 'v5') : negAdj(h2.adj.pred)) : (h2.become ? P(h2.adj.adv + 'なる', 'v5') : h2.adj.pred);""",
    """      const becomeV = (aj) => (aj.kind === 'v' ? P(/自信がある$/.test(aj.pred.plain()) ? aj.pred.plain().replace(/自信がある$/, '自信がつく') : aj.pred.plain() + 'ようになる', 'v5') : P(aj.adv + 'なる', 'v5'));
      let pr = h2.less ? (h2.become ? P(h2.adj.adv.replace(/に$/, '') + 'でなくなる', 'v5') : negAdj(h2.adj.pred)) : (h2.become ? becomeV(h2.adj) : h2.adj.pred);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
