import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a student who feels bored while studying may reach for a smartphone → 勉強中に退屈を感じる学生はスマートフォンに手を伸ばすかもしれない
# （主語の関係詞節の中の while / when + -ing のすぐあとに助動詞・述語の動詞が来るなら、while 以下で文を分けない。「勉強することが…かもしれない間に」にしない）
rep("""      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (!nounC(T[j + 1]) || ingVerb(j + 1, b)) && !isP(T[j - 1], ',') && !T.slice(j + 2, b).some(""",
    """      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && !isP(T[j - 1], ',') && T[j + 2] && T[j + 2].k === 'w' && (!!MODAL[T[j + 2].w] || (!!vc(T[j + 2], ['3sg', 'past']) && !nounC(T[j + 2]))) && T.slice(a + 1, j - 1).some((x, q) => x.k === 'w' && /^(?:who|which|that)$/.test(x.w) && T[a + q].k === 'w' && !!nounC(T[a + q]))) continue;
      if (/^(?:while|when)$/.test(s2.key) && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['ing']) && (!nounC(T[j + 1]) || ingVerb(j + 1, b)) && !isP(T[j - 1], ',') && !T.slice(j + 2, b).some(""")

# almost without noticing it → ほとんどそれに気づかずに（almost / nearly + without + -ing は前置詞句にかける。動詞の前の「ほとんど」にしない）
rep("""    // 前置詞句
    if (seq(j, ['such', 'as'])""",
    """    // 前置詞句
    if (/^(?:almost|nearly)$/.test(t.w) && isW(T[j + 1], 'without') && j + 2 < lim && T[j + 2].k === 'w' && !!vc(T[j + 2], ['ing'])) {
      const mAw = mark();
      const pAw = parsePP(j + 1, lim, { verbal: !!vg && vg.lemma !== 'be', lemma: vg ? vg.lemma : '' });
      if (pAw && /ずに$/.test(pAw.ja || '')) { st.other.push('ほとんど' + pAw.ja); return pAw.end; }
      fail(mAw);
    }
    if (seq(j, ['such', 'as'])""")

# left without saying anything → 何も言わずに（without + 動名詞の中の any 語は否定の 誰も・何も。「何かを言わずに」にしない）
rep("""      let g = vpNonfin(jg, lim, 'ing', { stop: true });""",
    """      let g = vpNonfin(jg, lim, 'ing', { stop: true, negCtx: key === 'without' });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
