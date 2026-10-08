import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) little formal education → 正式な教育がほとんどない（little + 形容詞 + 名詞）
rep("""    // There is little hope that … / little time → ほとんど〜ない（a little は別）""",
    """    // he had little formal education / little scientific evidence（little + 形容詞 + 名詞 → ほとんど〜ない）
    if (t.w === 'little' && !(i > 0 && T[i - 1].k === 'w' && /^(?:a|very|so|too|quite|only|the|this|that|my|your|his|her|our|their)$/.test(T[i - 1].w)) && i + 2 < lim && T[i + 1].k === 'w' && !!adjC(T[i + 1]) && !nounC(T[i + 1]) && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !PREP[T[i + 2].w] &&
      (UNCOUNT[T[i + 2].w] || /^(?:education|evidence|information|knowledge|experience|interest|support|help|progress|training|attention|research|food|water|sleep|exercise|money|time|effect|impact|value|chance|hope|need|reason)$/.test(T[i + 2].w))) {
      const mL2 = mark();
      const nomL2 = nominal(i + 1, lim, true);
      if (nomL2) return postMod({ ja: nomL2.ja, end: nomL2.end, head: nomL2.head, an: nomL2.an, c: nomL2.c, fewNeg: true, littleQ: true }, lim, o);
      fail(mL2);
    }
    // There is little hope that … / little time → ほとんど〜ない（a little は別）""")

# 2) the biggest challenges facing Japan → 日本が直面している最大の課題（問題の名詞 + facing は「〜が直面している」）
rep("""      if (v && v.end === e && verbal(v.pred) && !ppObj) {
        const s2 = v.parts.join('') + (form === 'ing'""",
    """      if (v && v.end === e && form === 'ing' && v.vg && v.vg.lemma === 'face' && /^(?:challenge|challenges|problem|problems|issue|issues|difficulty|difficulties|threat|threats|crisis|crises|task|tasks|question|questions|danger|dangers|risk|risks|dilemma|dilemmas)$/.test(node.head || '') && (v.parts || []).length === 1 && /に$/.test(v.parts[0])) {
        const rF = fin(v.parts[0].replace(/に$/, 'が') + '直面している', 'participle-mod');
        return Object.assign({}, rF, { ja: rF.ja.replace(/挑戦$/, '課題') });
      }
      if (v && v.end === e && verbal(v.pred) && !ppObj) {
        const s2 = v.parts.join('') + (form === 'ing'""")

# 3) must be willing / able to … は義務（〜なければならない）
rep("""T.slice(vg.idx + 1, vg.idx + 4).some((x) => x.k === 'w' && /^(?:ready|prepared|patient|brave|punctual""",
    """T.slice(vg.idx + 1, vg.idx + 4).some((x) => x.k === 'w' && /^(?:willing|able|ready|prepared|patient|brave|punctual""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
