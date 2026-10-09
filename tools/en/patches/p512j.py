import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) the lives of millions → 何百万もの人々の生活（of のない millions / thousands などは人の数）
rep("""    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""",
    """    if (T[i] && T[i].k === 'w' && /^(?:millions|thousands|billions|hundreds|dozens)$/.test(T[i].w) && !isW(T[i + 1], 'of') && (i + 1 >= lim || T[i + 1].k === 'p' || !T[i + 1] || (T[i + 1].k === 'w' && !nounC(T[i + 1]))) && i > 0 && T[i - 1].k === 'w' && (PREP[T[i - 1].w] || !!vc(T[i - 1], ['base', '3sg', 'past']))) {
      return { ja: ({ millions: '何百万もの人々', thousands: '何千もの人々', billions: '何十億もの人々', hundreds: '何百もの人々', dozens: '何十人もの人々' })[T[i].w], end: i + 1, an: true, pl: true, head: 'people' };
    }
    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""")

# 2) There are few things more important (to a child) than … → …ほど大切なものはほとんどない
rep("""    if (seq(0, ['what', 'if']) && b > 3) {""",
    """    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {
      let kF = 3;
      const hdF = T[kF] && /^(?:things|thing|people|one|places|place|activities|experiences|jobs)$/.test(T[kF].w || '') ? T[kF].w : '';
      if (hdF) kF++;
      if (T[2].w === 'nothing') kF = 3;
      if (/^(?:more|less)$/.test((T[kF] || {}).w || '') && T[kF + 1] && adjC(T[kF + 1])) {
        const aF = adjC(T[kF + 1]);
        const kTh = T.findIndex((x, q) => q > kF + 1 && q < b && isW(x, 'than'));
        if (kTh > 0 && aF.e) {
          const mF = mark();
          const ppF = kTh > kF + 2 ? parsePP(kF + 2, kTh, {}) : null;
          const nF = np(kTh + 1, b, {});
          if (nF && nF.end === b && (kTh === kF + 2 || (ppF && ppF.end === kTh))) {
            pick(kF + 1, aF.e);
            const gF = en.jp.adj(aF.e.ja);
            const thingF = /^(?:people|one)$/.test(hdF) ? '人' : (/^places?$/.test(hdF) ? '場所' : 'もの');
            const pastF = /^(?:was|were)$/.test(T[1].w);
            const negF = T[2].w === 'few' || T[2].w === 'little' ? (thingF === '人' ? (pastF ? 'ほとんどいなかった' : 'ほとんどいない') : (pastF ? 'ほとんどなかった' : 'ほとんどない')) : (thingF === '人' ? (pastF ? 'いなかった' : 'いない') : (pastF ? 'なかった' : 'ない'));
            const ppJ = ppF ? ppF.ja.replace(/(?:に|へ)$/, 'にとって') : '';
            name('comparative');
            return { ok: true, ja: ppJ + nF.ja + 'ほど' + gF.attr + thingF + 'は' + negF + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
          }
          fail(mF);
        }
      }
      reset(tokens);
    }
    if (seq(0, ['what', 'if']) && b > 3) {""")

# 3) more jobs than it destroys → それが破壊するより多くの仕事（than + 代名詞の主語 + 動詞だけ）
rep("""      const WISH = { like: '望む', want: '望む', wish: '望む', expect: '予想する', plan: '予定する', intend: '意図する', hope: '望む', need: '必要とする', think: '思う', imagine: '想像する' };""",
    """      const WISH = { like: '望む', want: '望む', wish: '望む', expect: '予想する', plan: '予定する', intend: '意図する', hope: '望む', need: '必要とする', think: '思う', imagine: '想像する' };
      if (wv && !WISH[wv.lemma] && kW === i + 1 && kW + 1 === lim && !BE[T[kW].w] && !HAVE[T[kW].w] && !DO[T[kW].w] && wv.e) {
        const pjD = P(verbSense(wv.e, true).core);
        const pastD = !!vc(T[kW], ['past']) && !vc(T[kW], ['base']);
        return (PRON[T[i].w].ja || '') + 'が' + (pastD ? pjD.form('past') : pjD.plain());
      }""")

# 4) The power went out → 停電した（電気・電力が主語の go out）
rep("""        if (it.it && it.it.phrase === 'pay for ~' && """,
    """        if (it.it && it.it.phrase === 'pay for ~' && """)

# 5) earlier generations → 以前の世代（比較級の より ごと置き換える）
rep("""      const a0 = en.jp.adj(aN.e.ja).attr;
      if (a0 && pre.indexOf(a0) >= 0) pre = pre.replace(a0, hN.ja);""",
    """      const a0 = en.jp.adj(aN.e.ja).attr;
      if (a0 && pre.indexOf('より' + a0) >= 0 && aN.form === 'comp') pre = pre.replace('より' + a0, hN.ja);
      else if (a0 && pre.indexOf(a0) >= 0) pre = pre.replace(a0, hN.ja);""")
rep("""    'early|stage stages|初期の', 'late|stage stages|後期の',""",
    """    'early|stage stages|初期の', 'late|stage stages|後期の', 'early|generation generations|以前の',""")

# 6) carry a smartphone → スマートフォンを持ち歩く / 7) 受け身の do + damage → 被害が出る
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'carry|smartphone smartphones phone phones umbrella umbrellas wallet wallets cash card cards passport passports|を|持ち歩く',""")
rep("""    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""",
    """    if (vg.passive && L === 'do' && !objs.length && o.subj && /^(?:damage|harm)$/.test(plainSubj(o.subj).head || '') && !st.agent) { name('passive'); return done(Object.assign({}, vg, { passive: false }), P('出る', 'v1'), st, tail(j, lim, st, o, vg), 'SV', o, [], { noStative: true }); }   // damage had been done → 被害が出ていた
    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
