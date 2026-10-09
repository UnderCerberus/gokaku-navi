import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I would encourage anyone who has the chance to study abroad to take it → 留学する機会がある人には誰にでもそれを生かすよう勧めたい
# （V + O + to do の O が関係詞節（中に to 不定詞を含む）で長いときは、最後の to + 原形の手前までを O にする）
rep("""    const ob = objBefore(i, lim, (x, q) => x.k === 'q' || (x.k === 'w' && (x.w === 'to' || ((x.w === 'not' || x.w === 'never') && isW(T[q + 1], 'to')) || x.w === 'that' || !!WH[x.w] || x.w === 'whether' || x.w === 'if' || (q > i && TELLV[L]""",
    """    if (OTOV[L] && !vg.passive && T.slice(i, lim).some((x) => x.k === 'w' && /^(?:who|that|which)$/.test(x.w))) {
      let lastTo = -1, cntTo = 0;
      for (let x = i + 1; x < lim - 1; x++) if (isW(T[x], 'to') && T[x + 1].k === 'w' && !!vc(T[x + 1], ['base'])) { lastTo = x; cntTo++; }
      if (cntTo >= 2) {
        const mOl = mark();
        const obL = np(i, lastTo, {});
        const infL = obL && obL.end === lastTo && obL.rel ? vpNonfin(lastTo + 1, lim, 'base', { subj: obL }) : null;
        if (infL && infL.end === lim && verbal(infL.pred)) { name('v-o-to'); return done(vg, OTOV[L][1](infL.neg ? infL.pred.aux('neg') : infL.pred, st), st, infL.end, 'SVOC', o, [objStr(obL, OTOV[L][0], st)].concat(infL.parts), { noStative: true, oto: { s: objStr(obL, OTOV[L][0], st), pron: obL.pron || '', an: !!obL.an, pl: !!obL.pl } }); }
        fail(mOl);
      }
    }
    const ob = objBefore(i, lim, (x, q) => x.k === 'q' || (x.k === 'w' && (x.w === 'to' || ((x.w === 'not' || x.w === 'never') && isW(T[q + 1], 'to')) || x.w === 'that' || !!WH[x.w] || x.w === 'whether' || x.w === 'if' || (q > i && TELLV[L]""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
