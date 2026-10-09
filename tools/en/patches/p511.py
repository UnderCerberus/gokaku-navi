import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) compared the brains of musicians with those of other people → 他の人々の脳と（比較の動詞・形容詞のあとの with / to + those of）
rep("""    if (/^(?:that|those)$/.test(t.w) && (isW(T[i + 1], 'of') || isW(T[i + 1], 'for') || isW(T[i + 1], 'in')) && i + 2 < lim && cmpBefore(i)) {""",
    """    if (/^(?:that|those)$/.test(t.w) && (isW(T[i + 1], 'of') || isW(T[i + 1], 'for') || isW(T[i + 1], 'in')) && i + 2 < lim && (cmpBefore(i) || (i > 0 && /^(?:with|to|from)$/.test(T[i - 1].w || '') && T.slice(0, i).some((x) => /^(?:compare|compared|compares|comparing|similar|different|differ|differs|same|like|unlike|identical)$/.test(x.w || ''))))) {""")

# 2) The key lies not in stricter laws but in better education → より厳しい法律ではなく、より良い教育にある（動詞のあとの not + 前置詞句 + but + 前置詞句）
rep("""  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;""",
    """  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      if (isW(T[j0], 'not') && vg && T[j0 + 1] && T[j0 + 1].k === 'w' && PREP[T[j0 + 1].w] && j0 + 3 < lim) {
        const mNb = mark();
        const pA = parsePP(j0 + 1, lim, { noCoord: true, verbal: true, lemma: vg.lemma });
        const kB = pA && isW(T[pA.end], 'but') ? pA.end + 1 : (pA && isP(T[pA.end], ',') && isW(T[pA.end + 1], 'but') ? pA.end + 2 : -1);
        const pB = kB > 0 && T[kB] && T[kB].k === 'w' && T[kB].w === T[j0 + 1].w ? parsePP(kB, lim, { verbal: true, lemma: vg.lemma }) : null;
        if (pA && pB) { name('not-but'); st.other.push(pA.ja.replace(/(?:に|で|へ)$/, '') + 'ではなく、' + pB.ja); j = pB.end; continue; }
        fail(mNb);
      }""")

# 3) not A but the way its people have adapted …（B が the way + 節などの長い名詞句: 関係詞なしで止まったら読み直す）
rep("""      if (d1 && d2 && d2.end < lim && !isW(T[k2d], 'what') && T[d2.end].k === 'w' && /^(?:that|which|who|whose|whom)$/.test(T[d2.end].w)) {""",
    """      if (d1 && d2 && d2.end < lim && !isW(T[k2d], 'what') && T[d2.end].k === 'w') {""")

# 4) As the population ages → 人口が高齢化するにつれて（age + 人口・社会の主語）
rep("""    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""",
    """    if (L === 'age' && !objs.length && !vg.passive && o.subj && /^(?:population|populations|society|societies|country|countries|nation|nations|workforce|japan|community|communities)$/.test(plainSubj(o.subj).head || '')) { return done(vg, P('高齢化する', 'suru'), st, tail(j, lim, st, o, vg), 'SV', o, [], { noStative: true }); }
    if (vg.passive && L === 'read' && !objs.length && isW(T[j], 'to')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
