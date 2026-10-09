import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# S V, not because A, but because B → SがVしたのは、AからではなくBからだ
rep("""    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""",
    """    {
      const kNb = T.findIndex((x, q) => q > 2 && q < b - 3 && isW(x, 'not') && isW(T[q + 1], 'because'));
      const kBb = kNb > 0 ? T.findIndex((x, q) => q > kNb + 3 && q < b - 2 && isW(x, 'but') && isW(T[q + 1], 'because')) : -1;
      if (kNb > 0 && kBb > 0) {
        const mNb = mark();
        const eM = isP(T[kNb - 1], ',') ? kNb - 1 : kNb, eA = isP(T[kBb - 1], ',') ? kBb - 1 : kBb;
        const mainNb = sentence(0, eM, { sub: true });
        const aNb = mainNb ? sentence(kNb + 2, eA, { sub: true }) : null;
        const bNb = aNb ? sentence(kBb + 2, b, { sub: true }) : null;
        if (mainNb && aNb && bNb) {
          name('not-but');
          const omNb = mainNb.subj && mainNb.subj.pron ? mainNb.subj.pron : null;
          return { ok: true, ja: mainNb.out({ part: 'が', form: 'attr' }) + 'のは、' + aNb.out({ part: 'が', omit: omNb }) + 'からではなく、' + bNb.out({ part: 'が', omit: omNb }) + 'から' + (mainNb.past ? 'だった' : 'だ') + '。', sp: '', names: NAMES.slice(), sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
        }
        fail(mNb);
        reset(tokens);
      }
    }
    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""")

# as serious a threat (to humanity) as climate change → 気候変動と同じくらい深刻な（人類への）脅威
rep("""    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""",
    """    if (isW(t, 'as') && i + 4 < lim && T[i + 1].k === 'w' && adjC(T[i + 1]) && /^(?:a|an)$/.test(T[i + 2].w || '') && !o.noAsAs) {
      const mAa = mark();
      const aAa = adjC(T[i + 1]);
      const nAa = np(i + 3, lim, { noRel: true, noCoord: true, pp: true, noAsAs: true });
      if (aAa && aAa.e && nAa && isW(T[nAa.end], 'as') && nAa.end + 1 < lim) {
        const cAa = np(nAa.end + 1, lim, { noRel: true });
        if (cAa) { pick(i + 1, aAa.e); name('as-as'); return { ja: cAa.ja + 'と同じくらい' + en.jp.adj(aAa.e.ja).attr + nAa.ja, end: cAa.end, head: nAa.head, an: nAa.an }; }
      }
      fail(mAa);
    }
    // more and more ~（ますます多くの〜）
    if (seq(i, ['more', 'and', 'more']) && i + 3 < lim) {""")

# feel uncomfortable speaking in public → 人前で話すのを不快に感じる（feel + 形容詞 + ～ing）
rep("""    if (L === 'leave' && i + 2 < lim) {
      const mLw = mark();""",
    """    if (L === 'feel' && i + 2 < lim && T[i].k === 'w' && adjC(T[i]) && T[i + 1].k === 'w' && !!vc(T[i + 1], ['ing']) && !nounC(T[i + 1]) && /^(?:uncomfortable|comfortable|nervous|awkward|confident|guilty|bad|good|happy|sad|embarrassed|anxious|shy|strange|weird|odd|uneasy)$/.test(T[i].w)) {
      const mFi = mark();
      const aFi = adjC(T[i]);
      const vFi = vpNonfin(i + 1, lim, 'ing', {});
      if (aFi && aFi.e && vFi && vFi.end === lim && verbal(vFi.pred)) { pick(i, aFi.e); return done(vg, P(vpJoin(vFi, 'dict') + 'のを' + en.jp.adj(aFi.e.ja).adv + '感じる', 'v1'), st, lim, 'SVC', o, [], { noStative: true }); }
      fail(mFi);
    }
    if (L === 'leave' && i + 2 < lim) {
      const mLw = mark();""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
