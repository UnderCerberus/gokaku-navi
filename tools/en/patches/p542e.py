import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# pretend I was talking to a friend → 友達と話しているふりをする / He pretended that he was asleep → 眠っているふりをした
# （pretend + (that) 節は「〜ふりをする」。節の主語が I / you / 主節の主語なら省く。「ふりをする…ことを覚えていた」にしない）
rep("""  function vpFrame(vg, i, lim, st, o) {
    const L = vg.lemma, t = T[i];
    if (!t || i >= lim || vg.passive) return null;
    const m = mark();
    let core = null;""",
    """  function vpFrame(vg, i, lim, st, o) {
    const L = vg.lemma, t = T[i];
    if (!t || i >= lim || vg.passive) return null;
    const m = mark();
    let core = null;
    if (L === 'pretend') {
      const kPr = isW(t, 'that') ? i + 1 : i;
      if (kPr + 1 < lim && T[kPr].k === 'w' && PRON[T[kPr].w] && PRON[T[kPr].w].sub && T[kPr + 1].k === 'w' && (!!BE[T[kPr + 1].w] || !!MODAL[T[kPr + 1].w] || !!vc(T[kPr + 1], ['base', '3sg', 'past']))) {
        const cPr = sentence(kPr, lim, { sub: true });
        if (cPr) {
          const omPr = /^(?:i|you)$/.test(T[kPr].w) || (o.subj && o.subj.pron && samePerson(o.subj.pron, T[kPr].w)) ? T[kPr].w : null;
          const sPr = cPr.out({ part: 'が', form: 'attr', omit: omPr }).replace(/(て|で)いた$/, '$1いる').replace(/だった$/, 'である').replace(/なかった$/, 'ない');
          name('that-clause');
          return done(vg, P(sPr + 'ふりをする', 'suru'), st, lim, 'SVO', o, [], { noStative: true });
        }
        fail(m);
      }
    }""")

# 主格の代名詞（I / he / she / we / they）は動詞の目的語にしない（advice to pretend I was asleep の pretend の目的語を I にしない）
rep("""        if (n) { objs.push(n); j = n.end; continue; }
        fail(m1);""",
    """        if (n && /^(?:i|he|she|we|they)$/.test(n.pron || '') && !n.coord && T[n.end] && T[n.end].k === 'w' && (!!BE[T[n.end].w] || !!MODAL[T[n.end].w] || !!vc(T[n.end], ['3sg', 'past']))) { fail(m1); break; }
        if (n) { objs.push(n); j = n.end; continue; }
        fail(m1);""")

# Then I remembered my teacher's advice → 先生の助言を思い出した（then / suddenly などの過去の remember は「思い出す」。「覚えていた」にしない）
rep("""    if (/^(?:begin|start)$/.test(vg.lemma) && /.から始まる$/.test(p.plain())""",
    """    if (vg.lemma === 'remember' && vg.past && !vg.perfect && !vg.prog && !vg.modal && !vg.passive && !neg && /^覚えている$/.test(p.plain()) && T.some((x) => x.k === 'w' && /^(?:then|suddenly|finally|immediately|soon|just)$/.test(x.w))) p = P('思い出す', 'v5');
    if (/^(?:begin|start)$/.test(vg.lemma) && /.から始まる$/.test(p.plain())""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
