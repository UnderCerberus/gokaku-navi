import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More needs to be done / More must be done / Unless more is done（主語の more = もっと多くのこと。動詞・助動詞が続くときだけ）
rep("""    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""",
    """    {
      const kMo = isW(T[i], 'more') ? i : ((seq(i, ['much', 'more']) || seq(i, ['far', 'more']) || seq(i, ['even', 'more']) || seq(i, ['still', 'more'])) ? i + 1 : (seq(i, ['a', 'lot', 'more']) ? i + 2 : -1));
      const nxMo = kMo >= 0 ? T[kMo + 1] : null;
      if (kMo >= 0 && kMo < lim && nxMo && nxMo.k === 'w' && (MODAL[nxMo.w] || /^(?:is|was|has|had|needs|needed|remains|remained)$/.test(nxMo.w))) return { ja: kMo > i ? 'さらに多くのこと' : 'もっと多くのこと', pron: 'more', end: kMo + 1, an: false };
    }
    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""")

# More must be done → もっと多くのことをしなければならない（主節）/ Unless more is done → もっと多くのことがなされない限り（従属節）
rep("""    if (vg.passive && L === 'delay' && !objs.length && o.subj && !o.subj.an) {""",
    """    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '')) {
      name('passive');
      if (o.sub || o.q) return done(vg, P('なす', 'v5'), st, j, 'SV', o, [], { noStative: true });
      st.subjWo = true;
      return done(Object.assign({}, vg, { passive: false }), P('する', 'suru'), st, j, 'SV', o, [], { noStative: true });
    }
    if (vg.passive && L === 'delay' && !objs.length && o.subj && !o.subj.an) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
