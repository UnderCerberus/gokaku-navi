import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The reason so many people fail is that they … → so many people は名詞句（be / 伝達動詞の後ろの that は so … that の that ではない）
rep("""    if (isW(t, 'so') && i + 2 < lim && /^(?:many|much)$/.test(T[i + 1].w || '') && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !T.slice(i + 2, lim).some((x) => isW(x, 'that'))) {""",
    """    if (isW(t, 'so') && i + 2 < lim && /^(?:many|much)$/.test(T[i + 1].w || '') && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !T.slice(i + 2, lim).some((x, q) => isW(x, 'that') && !(T[i + 1 + q] && T[i + 1 + q].k === 'w' && (!!BE[T[i + 1 + q].w] || (() => { const vT = vc(T[i + 1 + q], ['base', '3sg', 'past']); return !!vT && !nounC(T[i + 1 + q]) && (!!SAYV[vT.lemma] || !!THINKV[vT.lemma] || !!KNOWV[vT.lemma]); })())))) {   // The reason so many people fail is that … の that は so … that ではない""")

rep("""      for (let y = x + 3; y < b - 2 && !doneSm; y++) {
        if (!isW(T[y], 'that')) continue;
        const mSm = mark();
        const csSm = sentence(y + 1, b, { sub: true });""",
    """      for (let y = x + 3; y < b - 2 && !doneSm; y++) {
        if (!isW(T[y], 'that')) continue;
        if (T[y - 1].k === 'w' && BE[T[y - 1].w]) break;   // The reason so many people fail is that … の that は補語の節
        const mSm = mark();
        const csSm = sentence(y + 1, b, { sub: true });""")

rep("""|people|everyone|everybody|someone|somebody|nobody|anyone)$/.test(w) || !!cand(T[j], '名', ['pl']))) {
      const gap4 = { type: 'np', rel: true, used: false, ante: node.head };
      const cl6 = clause(j, e, { gap: gap4, sub: true });
      if (cl6 && gap4.used && cl6.subj && !cl6.subj.gerund) return fin(cl6.out({ part: 'が', form: 'attr' }), 'relative');
      return fail(m);""",
    """|people|everyone|everybody|someone|somebody|nobody|anyone)$/.test(w) || !!cand(T[j], '名', ['pl']) || (w === 'so' && /^(?:many|much)$/.test((T[j + 1] || {}).w || '')))) {
      const gap4 = { type: 'np', rel: true, used: false, ante: node.head };
      const cl6 = clause(j, e, { gap: gap4, sub: true });
      const vRs = node.head === 'reason' ? T.slice(j, e).map((x) => (x.k === 'w' ? vc(x, ['base', '3sg', 'past']) : null)).find((x) => !!x) : null;   // the reason he gave（挙げる）は目的語の穴、the reason people fail は穴なし
      if (cl6 && gap4.used && cl6.subj && !cl6.subj.gerund && !(vRs && !/^(?:give|explain|understand|know|find|have|offer|provide|state|cite|see|mention|accept|discover|learn|guess|suggest|show|tell)$/.test(vRs.lemma))) return fin(cl6.out({ part: 'が', form: 'attr' }), 'relative');
      // The reason so many people fail to keep … → 多くの人々が…守れない理由（reason の接触節は目的語の穴なしでもよい）
      if (node.head === 'reason' && !node.pl) { fail(m); const cl6r = clause(j, e, { sub: true }); if (cl6r && cl6r.subj && !cl6r.subj.gerund && cl6r.pred && verbal(cl6r.pred)) return fin(cl6r.out({ part: 'が', form: 'attr' }), 'relative'); }
      return fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
