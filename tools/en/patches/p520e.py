import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The town's economy, once dependent on fishing, now relies … → かつては漁業に頼っていた町の経済は
# The city, famous for its temples, attracts … → 寺で有名な都市は（be + 形容詞 + 前置詞の熟語の挿入。主節が現在なら現在の連体形）
rep("""        // The strongest form of this claim, popular in the last century, holds …（形容詞 + 前置詞句の挿入 → 前世紀に人気があり、）
        if (!len && x + 3 < b && T[x + 1].k === 'w' && adjC(T[x + 1]) && !nounC(T[x + 1])""",
    """        if (!len && x + 3 < b && T[x + 1].k === 'w') {
          const ADVI = { once: 'かつては', formerly: '以前は', previously: '以前は', still: 'まだ', now: '今では', largely: '主に', mostly: '主に', increasingly: 'ますます' };
          const kA = ADVI[T[x + 1].w] && T[x + 2] && T[x + 2].k === 'w' && !!adjC(T[x + 2]) ? x + 2 : x + 1;
          const acI = T[kA].k === 'w' && !nounC(T[kA]) && !vc(T[kA], ['base', '3sg', 'past']) ? adjC(T[kA]) : null;
          const beI = acI && T[kA + 1] && T[kA + 1].k === 'w' && PREP[T[kA + 1].w] ? idiomIndex().be.find((q) => q.shape === 'obj' && q.lit.length === 2 && q.lit[0] === T[kA].w && q.lit[1] === T[kA + 1].w && /^〜/.test(q.ja)) : null;
          let yI = -1;
          if (beI) for (let z = kA + 2; z < b - 1; z++) { if (isP(T[z], ',')) { yI = z; break; } }
          if (beI && yI > kA + 2) {
            const mI = mark();
            const nI = np(kA + 2, yI, {});
            if (nI && nI.end === yI) {
              const vMain = T.slice(yI + 1, b).find((q9) => q9.k === 'w' && !ADV[q9.w] && (!!BE[q9.w] || !!HAVE[q9.w] || !!MODAL[q9.w] || !!DO[q9.w] || !!vc(q9, ['3sg', 'past', 'base'])));
              const pastI = /^(?:once|formerly|previously)$/.test(T[x + 1].w) || (!!vMain && (/^(?:was|were|had|did|could|would)$/.test(vMain.w) || (!!vc(vMain, ['past']) && !vc(vMain, ['base', '3sg']))));
              const objI = /^(?:its|their|his|her)$/.test(T[kA + 2].w || '') ? nI.ja.replace(/^(?:その|それの|それらの|彼らの|彼の|彼女の)/, '') : nI.ja;
              const pI = P(beI.ja.replace(/^〜/, objI).replace(/である$/, 'だ'));
              pick(kA, acI.e);
              len = yI - x - 1;
              ja = (kA > x + 1 ? ADVI[T[x + 1].w] : '') + (pastI ? pI.form('past') : pI.form('attr')) + '\u0002';   // 主語の前に連体修飾で置く
              if (T.slice(a, x).some((q9) => isP(q9, ','))) { len = 0; ja = ''; fail(mI); }
            } else fail(mI);
          }
        }
        // The strongest form of this claim, popular in the last century, holds …（形容詞 + 前置詞句の挿入 → 前世紀に人気があり、）
        if (!len && x + 3 < b && T[x + 1].k === 'w' && adjC(T[x + 1]) && !nounC(T[x + 1])""")

# rely on ~ の現在は状態（頼っている）
rep("""        if (it.it && it.it.phrase === 'depend on ~' && !obj.wh && (obj.an ||""",
    """        if (it.it && it.it.phrase === 'depend on ~' && o.subj && (o.subj.clause || (o.subj.gerund && /か$/.test(o.subj.ja || '')))) jaT = '〜次第だ';   // Whether or not we succeed depends on you → あなた次第だ / depends on how many people … → 〜か次第だ
        else if (it.it && it.it.phrase === 'depend on ~' && !obj.wh && (obj.an ||""")
rep("""        if (it.it && /^give up ~$|^give ~ up$/.test(it.it.phrase) && /^(?:heat|energy|warmth|oxygen|electrons|light)$/.test(obj.head || '')) jaT = '〜を放出する';""",
    """        if (it.it && it.it.phrase === 'rely on ~' && !vg.past && !vg.modal && !vg.prog && !vg.perfect && !vg.nonfin && !vg.imp && !vg.passive && !obj.wh && !(isW(T[0], 'the') && T[1] && T[1].k === 'w' && (/^(?:more|less|fewer)$/.test(T[1].w) || (!!adjC(T[1]) && adjC(T[1]).form === 'comp')))) jaT = '〜に頼っている';   // now relies largely on tourism → 主に観光業に頼っている
        if (it.it && it.it.phrase === 'bring in ~' && /(?:^| )(?:visitors?|tourists?|customers?|people|crowds?|guests?|fans?|shoppers?|travell?ers?)$/.test(obj.head || '')) jaT = '〜を呼び込む';   // brings in visitors from all over the country → 全国から訪問者を呼び込む
        else if (it.it && it.it.phrase === 'bring in ~' && /(?:^| )(?:money|revenues?|income|cash|profits?|dollars?|millions?|billions?|tax|taxes)$/.test(obj.head || '')) jaT = '〜をもたらす';
        if (it.it && /^give up ~$|^give ~ up$/.test(it.it.phrase) && /^(?:heat|energy|warmth|oxygen|electrons|light)$/.test(obj.head || '')) jaT = '〜を放出する';""")
rep("""largely: /^(?:depend|rely)$/.test(vg.lemma) ? '大部分' : null };""",
    """largely: /^(?:depend|rely)$/.test(vg.lemma) ? '主に' : null };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
