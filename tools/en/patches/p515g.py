import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) …, eager to enjoy the first day of summer vacation → 夏休みの初日を楽しみたくて（文末の 形容詞 + to do）
rep("""      if (isW(T[j0], 'until') && vg && (vg.neg || st.neg) && !vg.modal""",
    """      if (j0 > j && isP(T[j], ',') && T[j0] && T[j0].k === 'w' && /^(?:eager|anxious|keen|desperate|determined|afraid|unable|ready|willing)$/.test(T[j0].w) && isW(T[j0 + 1], 'to') && j0 + 2 < lim) {
        const mEg = mark();
        const iEg = vpNonfin(j0 + 2, lim, 'base', {});
        if (iEg && iEg.end === lim && verbal(iEg.pred)) {
          const wEg = T[j0].w;
          st.other.unshift(/^(?:eager|anxious|keen|desperate)$/.test(wEg) ? iEg.parts.join('') + iEg.pred.form('stem') + 'たくて' : (wEg === 'determined' ? vpJoin(iEg, 'dict') + 'と決意して' : (wEg === 'afraid' ? vpJoin(iEg, 'dict') + 'のを恐れて' : (wEg === 'unable' ? vpJoin(iEg, 'neg').replace(/ない$/, 'られず') : vpJoin(iEg, 'dict') + 'つもりで'))));
          j = lim; continue;
        }
        fail(mEg);
      }
      if (isW(T[j0], 'until') && vg && (vg.neg || st.neg) && !vg.modal""")

# 2) imagine situations they have never experienced（名詞 + 主語の代名詞 + 動詞 の接触節があれば、that のない節より目的語）
rep("""      if (!fullObj && !isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) {""",
    """      if (!fullObj && !isW(t, 'that') && /^(?:imagine|remember|forget|understand|describe|explain)$/.test(L) && T.slice(i + 1, lim - 1).some((x, q) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub && T[i + q].k === 'w' && !!nounC(T[i + q]) && !PRON[T[i + q].w])) { const mIc = mark(); const nIc = np(i, lim, {}); fullObj = !!nIc && nIc.end === lim && !nIc.pron; fail(mIc); }   // imagine situations they have never experienced
      if (!fullObj && !isW(t, 'that') && /^(?:find|found|know|see|show|learn|discover|notice|realize|feel|hear|recognize|identify)$/.test(L)) {""")

# 3) …, with babies needing far more sleep than adults → …。赤ちゃんは大人よりはるかに多くの睡眠を必要とする（文末の with + 名詞 + ～ing）
rep("""    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""",
    """    {
      const kWi = T.findIndex((x, q) => q > 3 && q < b - 3 && isP(x, ',') && isW(T[q + 1], 'with'));
      if (kWi > 0 && !tokens.__withSplit) {
        const mWi = mark();
        const nWi = np(kWi + 2, b, { noRel: true, noCoord: true });
        const vWi = nWi && T[nWi.end] && T[nWi.end].k === 'w' && !!vc(T[nWi.end], ['ing']) ? vpNonfin(nWi.end, b, 'ing', { subj: nWi }) : null;
        if (vWi && vWi.end === b && verbal(vWi.pred)) {
          const endWi = Object.assign({}, tokens[b] || tokens[b - 1], { s: '.', w: '.', k: 'p' });
          const tWi = tokens.slice(0, kWi).concat([endWi]);
          tWi.__withSplit = true;
          const wJa = nWi.ja + 'は' + vpJoin(vWi, 'dict');
          const rWi = translate1(tWi);
          reset(tokens);
          if (rWi && rWi.ok) return Object.assign({}, rWi, { ja: rWi.ja.replace(/。$/, '') + '。' + wJa + '。' });
        } else fail(mWi);
      }
    }
    if (isW(T[0], 'there') && T[1] && /^(?:is|are|was|were)$/.test(T[1].w || '') && T[2] && /^(?:few|no|nothing|little)$/.test(T[2].w || '') && b > 6) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
