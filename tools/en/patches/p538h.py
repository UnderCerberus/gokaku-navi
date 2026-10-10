import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It was the first time I had ever made anything from scratch, and … → 一から何かを作ったのは初めてだった（it + be + the first time + 節: 並列の中でも読む。had ever + 過去分詞 は「〜した」）
rep("""    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time']) && isW(T[j + 3], 'for') && j + 5 < b) {""",
    """    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time']) && j + 4 < b && T[j + 3].k === 'w' && (isW(T[j + 3], 'that') || (PRON[T[j + 3].w] && PRON[T[j + 3].w].sub && T[j + 3].w !== 'it'))) {
      const kFc = isW(T[j + 3], 'that') ? j + 4 : j + 3;
      const mFc = mark();
      const cFc = sentence(kFc, b, { sub: true });
      if (cFc && cFc.subj) {
        name('idiom');
        const sFc = cFc.out({ part: 'が', form: 'attr', past: true }).replace(/たことが(?:ある|あった)$/, 'た').replace(/^私が/, '').replace(/^(.*?)(?:今までに|これまでに)/, '$1');
        return mkClause(null, done(vg, P('初めてだ', 'da'), st, b, 'SVC', o, [sFc + 'のは'], { noStative: true }), '');
      }
      fail(mFc);
    }
    if (vg.lemma === 'be' && !vg.neg && seq(j, ['the', 'first', 'time']) && isW(T[j + 3], 'for') && j + 5 < b) {""")

# 文全体の the first time 規則: , and / , but の並列を含む文は並列の側で読む（それが楽しかったのは初めてだった にしない）。had ever + 過去分詞 も「〜した」
rep("""    if ((seq(0, ['this', 'is', 'the', 'first', 'time']) || seq(0, ['it', 'is', 'the', 'first', 'time']) || seq(0, ['this', 'was', 'the', 'first', 'time']) || seq(0, ['it', 'was', 'the', 'first', 'time'])) && b > 6) {""",
    """    if ((seq(0, ['this', 'is', 'the', 'first', 'time']) || seq(0, ['it', 'is', 'the', 'first', 'time']) || seq(0, ['this', 'was', 'the', 'first', 'time']) || seq(0, ['it', 'was', 'the', 'first', 'time'])) && b > 6 && !T.slice(0, b).some((x, q) => isP(x, ',') && T[q + 1] && T[q + 1].k === 'w' && /^(?:and|but|so)$/.test(T[q + 1].w))) {""")
rep("""        const outFt = cFt.out({ part: 'が', form: 'attr', past: true }).replace(/たことがある$/, 'た').replace(/^私が/, '')""",
    """        const outFt = cFt.out({ part: 'が', form: 'attr', past: true }).replace(/たことが(?:ある|あった)$/, 'た').replace(/^(.*?)(?:今までに|これまでに)/, '$1').replace(/^私が/, '')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
