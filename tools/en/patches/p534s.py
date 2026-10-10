import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# it proved impossible to stop the flow of information / it seemed difficult to … → 情報の流れを止めることは不可能だと分かった（it + 連結動詞 + 形容詞 + to 不定詞）
rep("""    // It costs a lot of money to travel abroad → 海外を旅行するのにたくさんお金がかかる / It cost me 5,000 yen to fix it → 直すのに5000円かかった""",
    """    if (/^(?:prove|seem|appear|remain)$/.test(vg.lemma) && !vg.passive && j + 2 < b) {
      const mPr = mark();
      const adPr = adjAt(j, b);
      if (adPr && isW(T[adPr.end], 'to') && adPr.end + 1 < b && T[adPr.end + 1].k === 'w' && (!!vc(T[adPr.end + 1], ['base']) || isW(T[adPr.end + 1], 'be'))) {
        const infPr = vpNonfin(adPr.end + 1, b, 'base', {});
        if (infPr && infPr.end === b && verbal(infPr.pred)) {
          pick(adPr.idx, adPr.e);
          name('it-to');
          const fPr = adPr.adj;
          const bodyPr = (adPr.deg || '') + fPr.pred.plain();
          const corePr = vg.lemma === 'prove' ? P(bodyPr + 'と分かる', 'v5') : (vg.lemma === 'become' ? becomeP(fPr) : (vg.lemma === 'remain' ? P(bodyPr.replace(/だ$/, '') + 'ままだ', 'da') : P(bodyPr.replace(/だ$/, '') + 'ように思われる', 'v1')));
          return mkClause(null, done(vg, corePr, st, b, 'SVC', o, [vpJoin(infPr, 'dict') + 'ことは'], { noStative: true }), '');
        }
      }
      fail(mPr);
    }
    // It costs a lot of money to travel abroad → 海外を旅行するのにたくさんお金がかかる / It cost me 5,000 yen to fix it → 直すのに5000円かかった""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
