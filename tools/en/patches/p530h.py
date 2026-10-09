import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# part of studying → 勉強することの一部（part of + 動名詞も「〜の一部」）
rep("""        let inner2 = np1(i + 2, lim, o);""",
    """        let inner2 = np1(i + 2, lim, o);
        if (!inner2 && /^(?:part|most|all|much)$/.test(t.w) && ingVerb(i + 2, lim)) { const gIn = gerundNP(i + 2, lim); if (gIn) inner2 = gIn; }   // part of studying""")

# far more words → はるかに多くの語（far / much / many + more + 名詞 の程度は名詞句の中）
rep("""    if (t.w === 'what' && !o.noRel && !o.noWhat) {
      const wc = whatClause(i, lim); if (wc) return wc;""",
    """    if (/^(?:far|much|many)$/.test(t.w) && isW(T[i + 1], 'more') && i + 2 < lim && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !PREP[T[i + 2].w] && !vc(T[i + 2], ['base', 'past', '3sg']) && !(i > 0 && /^(?:spend|spends|spent|spending)$/.test((T[i - 1] || {}).w || ''))) {
      const mFm = mark();
      const nFm = np1(i + 1, lim, o);
      if (nFm && /^(?:より|もっと)多くの/.test(nFm.ja || '')) return Object.assign({}, nFm, { ja: nFm.ja.replace(/^(?:より|もっと)多くの/, 'はるかに多くの') });
      fail(mFm);
    }
    if (t.w === 'what' && !o.noRel && !o.noWhat) {
      const wc = whatClause(i, lim); if (wc) return wc;""")

# students who sleep too little → あまりにも少ししか眠らない（too little の副詞。ほとんど眠らない にしない）
# as many times as they want → 好きなだけ何度でも（ほしいだけの時間 にしない）
rep("""    // ran fast and hard / for longer and more eagerly than …（副詞の並列）""",
    """    if (isW(t, 'too') && isW(T[j + 1], 'little') && vg && !vg.passive && (j + 2 >= lim || T[j + 2].k === 'p' || (T[j + 2].k === 'w' && !nounC(T[j + 2]) && !adjC(T[j + 2])))) { st.manner.push('あまりにも少ししか'); st.neg = true; return j + 2; }
    if (seq(j, ['as', 'many', 'times', 'as']) && T[j + 4] && PRON[T[j + 4].w] && PRON[T[j + 4].w].sub && T[j + 5] && /^(?:want|wants|wanted|like|likes|liked|need|needs|needed|wish)$/.test(T[j + 5].w || '') && (j + 6 >= lim || T[j + 6].k === 'p')) { st.manner.push('好きなだけ何度でも'); return j + 6; }
    // ran fast and hard / for longer and more eagerly than …（副詞の並列）""")

# move their classes online → 授業をオンラインに移す / students … commuting → 通学する
rep("""    if (vg.lemma === 'show' && !vg.passive && sj && !anim && /^見せる$/.test(p.plain())""",
    """    if (vg.lemma === 'move' && !vg.passive && o.hasObj && T.some((x, q) => q > vg.idx && isW(x, 'online'))) { p = P('移す', 'v5'); st.manner = st.manner.map((x) => x.replace(/^オンラインで$/, 'オンラインに')); st.other = st.other.map((x) => x.replace(/^オンラインで$/, 'オンラインに')); }
    if (vg.lemma === 'commute' && /^通勤する$/.test(p.plain()) && T.some((x) => x.k === 'w' && /^(?:student|students|pupil|pupils|child|children|schoolchildren|school)$/.test(x.w))) p = P('通学する', 'suru');
    if (vg.lemma === 'show' && !vg.passive && sj && !anim && /^見せる$/.test(p.plain())""")

# missed seeing their friends every day → 毎日友達に会うことができなくて寂しく思う（miss + 動名詞 は「逃す」ではない）
rep("""      else if (L === 'take' && objs.length === 1 && objs[0].pron === 'it'""",
    """      else if (L === 'miss' && objs.length === 1 && objs[0].gerund && /こと$/.test(objs[0].ja || '') && !vg.passive) sense = { particle: 'ができなくて', core: '寂しく思う', tr: true };
      else if (L === 'take' && objs.length === 1 && objs[0].pron === 'it'""")

# the strengths of both styles → 両方の様式の長所（複数形の strengths は 長所）/ review the material → 教材（勉強の文脈）
rep("""    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'savings')""",
    """    if (node && !node.pron && node.end >= 1 && isW(T[node.end - 1], 'strengths') && /力$/.test(node.ja || '')) node = Object.assign({}, node, { ja: node.ja.replace(/力$/, '長所') });
    if (node && !node.pron && node.end >= 1 && /^materials?$/.test(T[node.end - 1].w || '') && /材料/.test(node.ja || '') && T.some((x) => x.k === 'w' && /^(?:review|reviewing|reviewed|study|studying|studied|learn|learning|teach|teaching|class|classes|lesson|lessons|exam|exams|test|tests|course|courses|textbook|textbooks|students|student)$/.test(x.w))) node = Object.assign({}, node, { ja: node.ja.replace(/材料/, '教材') });
    if (node && !node.pron && node.end >= 2 && isW(T[node.end - 1], 'savings')""")

# make education more flexible and open to everyone（形容詞 and 形容詞にもなる語は、助動詞の述語の並列にしない → より柔軟で誰にでも開かれた）
rep("""        if (x - 2 > v0 && T[x - 2].k === 'w' && PREP[T[x - 2].w] && !!nounC(T[x - 1]) && !!nounC(T[x + 1]) && (x + 2 >= b || T[x + 2].k === 'p')) return null;   // regardless of age or experience""",
    """        if (x - 2 > v0 && T[x - 2].k === 'w' && PREP[T[x - 2].w] && !!nounC(T[x - 1]) && !!nounC(T[x + 1]) && (x + 2 >= b || T[x + 2].k === 'p')) return null;   // regardless of age or experience
        if (T[x - 1].k === 'w' && !!adjC(T[x - 1]) && !nounC(T[x - 1]) && !vc(T[x - 1], ['base']) && !!adjC(T[x + 1]) && T.slice(v0, x - 1).some((y) => y.k === 'w' && /^(?:make|makes|made|keep|keeps|kept|find|found|leave|left|get|become)$/.test(y.w))) return null;   // make education more flexible and open to everyone""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
