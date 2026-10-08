import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) Those who want to succeed … learn from their failures → 自分の失敗（文頭の those who は人）
rep("""    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && /^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w)) {""",
    """    if (T[i].w === 'their' && isW(T[0], 'those') && isW(T[1], 'who')) return 'an';
    if (T[i].w === 'they' && i > 1 && T[i - 1].k === 'w' && /^(?:and|but|so|because|when|if|although|though|while|since|as|until|after|before)$/.test(T[i - 1].w)) {""")

# 2) break down: プラスチック・ごみ・食べ物などが主語なら 分解される（故障する ではない）
rep("""        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub)) && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join""",
    """        if (it.it && it.it.phrase === 'break down' && o.subj && !o.subj.an && /^(?:plastic|plastics|waste|wastes|food|foods|leaves|material|materials|chemical|chemicals|bottle|bottles|bag|bags|garbage|trash|matter|substance|substances|protein|proteins|fat|fats|cell|cells|rock|rocks|wood|paper|bodies|body)$/.test(plainSubj(o.subj).head || '')) { r = done(vg, P('分解される', 'v1'), st, tail(i + n, lim, st, o, vg), 'SV', o, [], { noStative: true }); if (r) { useIdiom(it.it); name('idiom'); return r; } fail(m); continue; }   // plastic does not break down easily → 簡単に分解されない
        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub)) && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join""")

# 3) the volunteers, most of whom were students, … → ほとんどが学生だったボランティア（数量 + of whom / which）
rep("""    let nonRestr = false;""",
    """    if (isP(T[j], ',') && j + 4 < lim && /^(?:most|some|many|all|both|several|one|two|three|half|each)$/.test(T[j + 1].w || '') && isW(T[j + 2], 'of') && /^(?:whom|which)$/.test(T[j + 3].w || '')) {
      let eQ = T.findIndex((x, q) => q > j + 4 && q < lim && isP(x, ','));
      if (eQ < 0) eQ = lim;
      const QW = { most: 'ほとんど', some: '一部', many: '多く', all: 'みな', both: '両方', several: '何人か', one: '1人', two: '2人', three: '3人', half: '半分', each: 'それぞれ' };
      const pq = predOnly(j + 4, eQ, { subj: { ja: QW[T[j + 1].w], an: T[j + 3].w === 'whom' }, sub: true });
      if (pq) { name('relative'); return Object.assign({}, node, { ja: QW[T[j + 1].w] + 'が' + pq.out({ form: 'attr' }) + node.ja, end: eQ < lim ? eQ + 1 : eQ, rel: true }); }
      fail(m);
    }
    let nonRestr = false;""")

# 4) What makes this novel so interesting is …（so + 形容詞。後ろに that がなければ とても）
rep("""    for (let av0 = advBeforeAdj(k, lim); av0 && k < lim - 1; av0 = advBeforeAdj(k, lim)) { deg += av0; k++; }""",
    """    for (let av0 = advBeforeAdj(k, lim); av0 && k < lim - 1; av0 = advBeforeAdj(k, lim)) { deg += av0; k++; }
    if (isW(T[k], 'so') && k + 1 < lim && !!adjC(T[k + 1]) && !T.slice(k + 2, lim).some((x) => isW(x, 'that'))) { deg += 'とても'; k++; }   // makes this novel so interesting → この小説をとても興味深くする""")

# 5) more quickly and cheaply than before → 以前より速く安く（比較の副詞の並列 + than）
rep("""      if ((a.comp || more) && isW(T[k + 1], 'than') && k + 2 < lim) {""",
    """      if ((a.comp || more) && isW(T[k + 1], 'and') && k + 4 < lim && T[k + 2].k === 'w' && !!advC(T[k + 2]) && !nounC(T[k + 2]) && isW(T[k + 3], 'than')) {
        const m3c = mark();
        const a2c = advC(T[k + 2]);
        const elC = thanEllipsis(k + 4, lim);
        const nC = elC ? null : np(k + 4, lim, { noRel: true });
        if (elC || nC) { name('comparative'); if (a2c.e) pick(k + 2, a2c.e); st.manner.push((elC || nC.ja) + 'より' + mul + a.ja + a2c.ja); return elC ? lim : nC.end; }
        fail(m3c);
      }
      if ((a.comp || more) && isW(T[k + 1], 'than') && k + 2 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
