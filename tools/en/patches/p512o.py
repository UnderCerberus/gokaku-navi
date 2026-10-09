import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し（第 508 組）
# 1) than it looks / than it seems は既存の規則（見た目より）に任せる。代名詞 + 動詞だけの省略は他動詞の動作に限る
rep("""      if (wv && !WISH[wv.lemma] && kW === i + 1 && kW + 1 === lim && !BE[T[kW].w] && !HAVE[T[kW].w] && !DO[T[kW].w] && wv.e) {""",
    """      if (wv && !WISH[wv.lemma] && kW === i + 1 && kW + 1 === lim && !BE[T[kW].w] && !HAVE[T[kW].w] && !DO[T[kW].w] && wv.e && !/^(?:look|seem|appear|sound|feel|smell|taste|get|use|say|tell|know|believe|suppose|guess|remember|used)$/.test(wv.lemma) && /〜を/.test(wv.e.ja || '')) {""")
# 2) sold in dozens more は人ではない（of か動詞の直後で、後ろに more がないときだけ）
rep("""    if (T[i] && T[i].k === 'w' && /^(?:millions|thousands|billions|hundreds|dozens)$/.test(T[i].w) && !isW(T[i + 1], 'of') && (i + 1 >= lim || T[i + 1].k === 'p' || !T[i + 1] || (T[i + 1].k === 'w' && !nounC(T[i + 1]))) && i > 0 && T[i - 1].k === 'w' && (PREP[T[i - 1].w] || !!vc(T[i - 1], ['base', '3sg', 'past']))) {""",
    """    if (T[i] && T[i].k === 'w' && /^(?:millions|thousands|billions|hundreds|dozens)$/.test(T[i].w) && !isW(T[i + 1], 'of') && !isW(T[i + 1], 'more') && (i + 1 >= lim || T[i + 1].k === 'p' || !T[i + 1] || (T[i + 1].k === 'w' && !nounC(T[i + 1]))) && i > 0 && T[i - 1].k === 'w' && (isW(T[i - 1], 'of') || !!vc(T[i - 1], ['base', '3sg', 'past']))) {""")
# 3) There are fewer and fewer young people は there 構文の既存の規則に任せる
rep("""    if ((seq(i, ['fewer', 'and', 'fewer']) || seq(i, ['less', 'and', 'less'])) && i + 3 < lim) {""",
    """    if ((seq(i, ['fewer', 'and', 'fewer']) || seq(i, ['less', 'and', 'less'])) && i + 3 < lim && !(i >= 2 && isW(T[i - 2], 'there'))) {""")
# 4) disagree → 意見が分かれている は 専門家・研究者などの複数の名詞の主語だけ（others disagree / agree or disagree は従来どおり）
rep("""    if (L === 'disagree' && !objs.length && !vg.passive && o.subj && (o.subj.pl || o.subj.coord || /^(?:we|they)$/.test(o.subj.pron || '')) && !T.slice(j, lim).some((x) => isW(x, 'with')) && !vg.neg) {""",
    """    if (L === 'disagree' && !objs.length && !vg.passive && o.subj && /^(?:experts?|scientists?|researchers?|economists?|historians?|scholars?|doctors?|specialists?|analysts?|critics|people|studies|opinions|educators?|psychologists?|philosophers?)$/.test(plainSubj(o.subj).head || '') && !T.some((x) => isW(x, 'agree')) && !T.slice(j, lim).some((x) => isW(x, 'with')) && !vg.neg) {""")
# 5) how many brothers の head は既存の規則に影響するので、別の名前（whHead）で持たせる
rep("""            return { end: n.end, type: 'np', node: { ja: cnt + n.ja, an: n.an, wh: true, head: n.head } };""",
    """            return { end: n.end, type: 'np', node: { ja: cnt + n.ja, an: n.an, wh: true, whHead: n.head } };""")
rep("""    if (vg.passive && L === 'do' && !objs.length && o.subj && /^(?:damage|harm)$/.test(plainSubj(o.subj).head || '') && !st.agent) {""",
    """    if (vg.passive && L === 'do' && !objs.length && o.subj && /^(?:damage|harm)$/.test(plainSubj(o.subj).head || o.subj.whHead || '') && !st.agent) {""")
# 6) come first は must / should / always のときだけ「最優先される」（Whoever comes first は 最初に来る）
rep("""        if (it.it && it.it.phrase === 'go out' && o.subj && """,
    """        if (it.it && it.it.phrase === 'come first' && !(vg.modal === 'must' || vg.modal === 'should' || (vg.advs || []).some((x) => x.w === 'always'))) continue;
        if (it.it && it.it.phrase === 'go out' && o.subj && """)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
