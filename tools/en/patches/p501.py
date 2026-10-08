import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) made it easier than ever to find information → これまでになく情報を見つけやすくした
rep("""        if (ob.pron === 'it' && !ob.det && ap2.end < lim) {
          const e0 = ap2.end, mf = mark();""",
    """        if (ob.pron === 'it' && !ob.det && ap2.end < lim) {
          let e0 = ap2.end, thanEv = '';
          const mf = mark();
          if (isW(T[e0], 'than') && /^(?:ever|before)$/.test((T[e0 + 1] || {}).w || '')) { thanEv = T[e0 + 1].w === 'ever' ? 'これまでになく' : '以前より'; e0 += isW(T[e0 + 2], 'before') ? 3 : 2; }   // easier than ever to … → これまでになく""")
rep("""                return done(vg, P(stemF + (ap2.lemma === 'easy' ? 'やすくする' : 'にくくする'), 'suru'), st, tail(infI.end, lim, st, o, vg), 'SVOC', o, (ft.np ? [ft.np.ja + 'が'] : []).concat(infI.parts), { noStative: true });
              }
              const s = (ft.np ? ft.np.ja + 'が' : '') + vpJoin(infI, 'dict') + 'こと';""",
    """                return done(vg, P(stemF + (ap2.lemma === 'easy' ? 'やすくする' : 'にくくする'), 'suru'), st, tail(infI.end, lim, st, o, vg), 'SVOC', o, (thanEv ? [thanEv] : []).concat(ft.np ? [ft.np.ja + 'が'] : []).concat(infI.parts), { noStative: true });
              }
              const s = thanEv + (ft.np ? ft.np.ja + 'が' : '') + vpJoin(infI, 'dict') + 'こと';""")

# 2) tell which sources can be trusted → どの情報源が信頼できるか見分ける（人の目的語のない tell + 疑問詞節）
rep("""        const cw2 = L === 'wonder' ? P('疑問に思う', 'v5') : (L === 'tell' ? P('教える', 'v1') :""",
    """        const cw2 = L === 'wonder' ? P('疑問に思う', 'v5') : (L === 'tell' ? (inanW ? P('教える', 'v1') : P('見分ける', 'v1')) :""")

# 3) girls are less likely than boys to finish school → 女子は男子より学校を終える可能性が低い
rep("""    // so ~ that ...
    if (isW(t, 'so') && j + 3 < lim) {""",
    """    if ((isW(t, 'more') || isW(t, 'less')) && isW(T[j + 1], 'likely') && isW(T[j + 2], 'than') && j + 5 < lim) {
      const mLk2 = mark();
      const nLk2 = np(j + 3, lim, { noRel: true, noCoord: true });
      const vLk2 = nLk2 && isW(T[nLk2.end], 'to') && nLk2.end + 1 < lim ? vpNonfin(nLk2.end + 1, lim, 'base', { subj: sj }) : null;
      if (vLk2) { name('comparative'); name('idiom'); return fin(P(vpJoin(vLk2, 'dict') + '可能性が' + nLk2.ja + 'より' + (isW(t, 'less') ? '低い' : '高い'), 'i'), vLk2.end); }
      fail(mLk2);
    }
    // so ~ that ...
    if (isW(t, 'so') && j + 3 < lim) {""")

# 4) She was asked why she had decided … → なぜ…決めたのかと尋ねられた（受け身の ask / tell + 疑問詞節）
rep("""  function vpPassiveInf(vg, i, lim, st, o) {""",
    """  function vpPassiveInf(vg, i, lim, st, o) {
    if (vg.passive && /^(?:ask|tell)$/.test(vg.lemma) && T[i] && T[i].k === 'w' && /^(?:why|what|where|when|how|whether|if|who|which)$/.test(T[i].w)) {
      const mAq = mark();
      const wcAq = whClause(i, lim);
      if (wcAq) { name('indirect-q'); return done(vg, P(vg.lemma === 'ask' ? '尋ねる' : '教える', 'v1'), st, tail(wcAq.end, lim, st, o, vg), 'SV', o, [wcAq.str + (vg.lemma === 'ask' ? 'と' : 'を')], { noStative: true }); }
      fail(mAq);
    }""")

# 5) so well designed that …（so + well + 過去分詞・形容詞）
rep("""      const lyS = j + 2 < lim && T[j + 1].k === 'w' && /ly$/.test(T[j + 1].w) && !ADV[T[j + 1].w] && !adjC(T[j + 1]) && !!advC(T[j + 1]) && (!!adjC(T[j + 2]) || !!vc(T[j + 2], ['pp'])) ? advC(T[j + 1]) : null;""",
    """      const lyS = j + 2 < lim && T[j + 1].k === 'w' && ((/ly$/.test(T[j + 1].w) && !ADV[T[j + 1].w] && !adjC(T[j + 1]) && !!advC(T[j + 1])) || T[j + 1].w === 'well') && (!!adjC(T[j + 2]) || !!vc(T[j + 2], ['pp'])) ? (T[j + 1].w === 'well' ? { ja: 'よく', e: null } : advC(T[j + 1])) : null;""")
rep("""  function lyJa(q) {
    const av = advC(T[q]);""",
    """  function lyJa(q) {
    if (T[q] && T[q].w === 'well') return 'よく';
    const av = advC(T[q]);""")

# 6) do not yet exist → まだ存在しない（not と動詞の間の yet）
rep("""      if (t.w === 'not') { neg = true; k++; continue; }""",
    """      if (t.w === 'not') { neg = true; k++; continue; }
      if (t.w === 'yet' && neg && k + 1 < lim && !!vc(T[k + 1], forms)) { advs.push({ a: { ja: 'まだ', kind: 'm', e: null }, w: 'yet' }); k++; continue; }   // do not yet exist → まだ存在しない""")

# 7) I had never seen so many stars → これほど多くの星（so many / much + 名詞。後ろに that がなければ）
rep("""    // So many people waste food / that so many people came → とても多くの人々（so + many / much + 名詞。後ろに that がある so … that 構文は除く）""",
    """    // So many people waste food / that so many people came → とても多くの人々（so + many / much + 名詞。後ろに that がある so … that 構文は除く）
    if (isW(t, 'so') && i + 2 < lim && /^(?:many|much)$/.test(T[i + 1].w || '') && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !T.slice(i + 2, lim).some((x) => isW(x, 'that'))) {
      const mSm = mark();
      const nSm = np1(i + 1, lim, o);
      if (nSm && nSm.end > i + 2) return Object.assign({}, nSm, { ja: nSm.ja.replace(/^(?:とても)?(?:多くの|たくさんの)/, 'これほど多くの') });
      fail(mSm);
    }""")
rep("""        (t.k === 'w' && /^(?:almost|nearly)$/.test(t.w) && j0 + 1 < lim && T[j0 + 1].k === 'w' && /^(?:half|all|every|most|everyone|everybody|everything|nobody|nothing|none|no|whole|anything|anyone|anybody)$/.test(T[j0 + 1].w) && !seq(j0 + 1, ['all', 'the', 'way']));""",
    """        (t.k === 'w' && /^(?:almost|nearly)$/.test(t.w) && j0 + 1 < lim && T[j0 + 1].k === 'w' && /^(?:half|all|every|most|everyone|everybody|everything|nobody|nothing|none|no|whole|anything|anyone|anybody)$/.test(T[j0 + 1].w) && !seq(j0 + 1, ['all', 'the', 'way'])) ||
        (isW(t, 'so') && j0 + 2 < lim && /^(?:many|much)$/.test(T[j0 + 1].w || '') && !!nounC(T[j0 + 2]) && !T.slice(j0 + 2, lim).some((x) => isW(x, 'that')));   // had never seen so many stars""")

# 8) spent years trying to … → 何年も費やした（冠詞のない複数の期間の名詞）
rep("""      else if (L === 'spend' && (objs[0].dur || /^何(?:年|か月|週間|日|時間|分)も$/.test(objs[0].ja)) && j < lim && ingVerb(j, lim) && !vg.passive) {""",
    """      else if (L === 'spend' && /^(?:years|decades|months|weeks|days|hours)$/.test(oh) && !objs[0].det && !objs[0].num && objs[0].ja && /^(?:年|十年|か月|月|週|週間|日|時間)$/.test(objs[0].ja) && j < lim && ingVerb(j, lim) && !vg.passive && (() => { objs[0] = Object.assign({}, objs[0], { ja: '何' + ({ years: '年', decades: '十年', months: 'か月', weeks: '週間', days: '日', hours: '時間' })[oh] + 'も' }); return false; })()) { /* 何年も に書き換えて下の規則へ */ }
      else if (L === 'spend' && (objs[0].dur || /^何(?:年|十年|か月|週間|日|時間|分)も$/.test(objs[0].ja)) && j < lim && ingVerb(j, lim) && !vg.passive) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
