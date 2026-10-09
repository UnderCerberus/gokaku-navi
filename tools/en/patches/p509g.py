import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 受け身の see / regard / view + as + 形容詞（may be seen as rude → 失礼だとみなされるかもしれない）
# should not be seen as A but as B → AとしてではなくBとして見られるべきだ
rep("""    // It is considered rude to talk loudly on the train → 電車の中で大声で話すのは失礼だと考えられている / He is considered a genius → 天才だと考えられている""",
    """    if (vg.passive && /^(?:see|regard|view|perceive|treat|describe)$/.test(vg.lemma) && isW(T[i], 'as') && i + 1 < lim) {
      const mSa = mark();
      const asX = (k) => {
        const aX = T[k] && T[k].k === 'w' && DET[T[k].w] === undefined && !nounC(T[k]) ? adjAt(k, lim) : null;
        if (aX) { pick(aX.idx, aX.e); return { ja: aX.deg + aX.adj.pred.plain().replace(/だ$/, '') , end: aX.end, adj: true }; }
        const nX = gerundNP(k, lim) || np(k, lim, {});
        return nX ? { ja: nX.ja, end: nX.end } : null;
      };
      const vJa = vg.lemma === 'see' ? '見られる' : 'みなされる';
      const xA = asX(i + 1);
      if (xA && vg.neg && isW(T[xA.end], 'but') && isW(T[xA.end + 1], 'as')) {
        const xB = asX(xA.end + 2);
        if (xB) { name('passive'); name('not-but'); return done(Object.assign({}, vg, { passive: false, neg: false }), P(xA.ja + (xA.adj ? 'もの' : '') + 'としてではなく、' + xB.ja + (xB.adj ? 'もの' : '') + 'として' + vJa, 'v1'), st, tail(xB.end, lim, st, o, vg), 'SV', o, [], { noStative: true }); }
      }
      if (xA && xA.adj) { name('passive'); return done(Object.assign({}, vg, { passive: false }), P(xA.ja + 'だとみなされる', 'v1'), st, tail(xA.end, lim, st, o, vg), 'SV', o, [], { noStative: true }); }
      fail(mSa);
    }
    // It is considered rude to talk loudly on the train → 電車の中で大声で話すのは失礼だと考えられている / He is considered a genius → 天才だと考えられている""")

# If nothing is done → もし何も行われなければ（主語の nothing + 受け身の do）
rep("""    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything)$/.test(o.subj.pron || '')) {""",
    """    if (vg.passive && L === 'do' && !objs.length && o.subj && !st.agent && /^(?:more|something|much|this|that|it|everything|anything|nothing)$/.test(o.subj.pron || '')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
