import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Memories that are judged important → 重要だと判断される記憶（judge / find + 形容詞の受け身も consider と同じ形）
rep("""    if (vg.passive && /^(?:consider|think|believe|regard|deem)$/.test(vg.lemma) && i < lim && T[i].k === 'w' && !isW(T[i], 'to') && !isW(T[i], 'as') && !isW(T[i], 'that')) {""",
    """    if (vg.passive && /^(?:consider|think|believe|regard|deem|judge)$/.test(vg.lemma) && i < lim && T[i].k === 'w' && !isW(T[i], 'to') && !isW(T[i], 'as') && !isW(T[i], 'that')) {""")
rep("""          const r = done(Object.assign({}, vg, { passive: false }), P(preC + apC.deg + apC.adj.pred.plain() + 'と考えられている', 'v1'), st, tail(eC, lim, st, o, vg), 'SV', o, [], { noStative: true });""",
    """          const r = done(Object.assign({}, vg, { passive: false }), P(preC + apC.deg + apC.adj.pred.plain() + (vg.lemma === 'judge' ? 'と判断される' : 'と考えられている'), 'v1'), st, tail(eC, lim, st, o, vg), 'SV', o, [], { noStative: true });""")

# Most teenagers, though, need … / Teachers, for their part, had to …（主語のあとに挟まった though・for one's part は文頭のつなぎ言葉として読む）
rep("""        if (!len && isW(T[x + 1], 'then') && isP(T[x + 2], ',')) { len = 1; ja = 'それならば'; }""",
    """        if (!len && isW(T[x + 1], 'then') && isP(T[x + 2], ',')) { len = 1; ja = 'それならば'; }
        if (!len && isW(T[x + 1], 'though') && isP(T[x + 2], ',')) { len = 1; ja = 'しかし'; }
        if (!len && isW(T[x + 1], 'for') && /^(?:my|your|his|her|our|their|its)$/.test((T[x + 2] || {}).w || '') && isW(T[x + 3], 'part') && isP(T[x + 4], ',')) { len = 3; ja = '一方'; }""")

# hold most classes in person while offering recorded lessons → 録画した授業を提供しながら（while + -ing は「〜しながら」、when + -ing は「〜するとき」）
rep("""    // ran fast and hard / for longer and more eagerly than …（副詞の並列）""",
    """    if (/^(?:while|when)$/.test(t.w) && vg && j + 1 < lim && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && !nounC(T[j + 1])) {
      const mWi = mark();
      const gWi = vpNonfin(j + 1, lim, 'ing', { subj: o.subj });
      if (gWi && verbal(gWi.pred) && gWi.end === lim) { st.other.push(t.w === 'while' ? gWi.parts.join('') + gWi.pred.form('stem') + 'ながら' : vpJoin(gWi, 'dict') + 'とき'); return gWi.end; }
      fail(mWi);
    }
    // ran fast and hard / for longer and more eagerly than …（副詞の並列）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
