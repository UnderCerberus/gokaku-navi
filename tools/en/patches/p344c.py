import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Neither can she → 彼女もできない / So will I → 私もそうする
rep("""      if (nSo && nSo.end === b) { const negSo = T[0].w !== 'so'; const pastSo = /^(?:did|was|were|had|could|would)$/.test(T[1].w); return { ok: true, ja: nSo.ja.replace(/^私$/, '私') + 'も' + (negSo ? (pastSo ? 'そうではなかった' : 'そうではない') : (pastSo ? 'そうだった' : 'そうだ')) + '。', sp: '', names: ['inversion'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }""",
    """      if (nSo && nSo.end === b) { const negSo = T[0].w !== 'so'; const pastSo = /^(?:did|was|were|had|could|would)$/.test(T[1].w); const mdSo = ({ can: ['できる', 'できない'], could: ['できた', 'できなかった'], will: ['そうする', 'そうしない'] })[T[1].w]; return { ok: true, ja: nSo.ja.replace(/^私$/, '私') + 'も' + (mdSo ? mdSo[negSo ? 1 : 0] : (negSo ? (pastSo ? 'そうではなかった' : 'そうではない') : (pastSo ? 'そうだった' : 'そうだ'))) + '。', sp: '', names: ['inversion'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() }; }""")

# She can. → 彼女はできる
rep("""      if (nAns && nAns.end === 1) return { ok: true, ja: nAns.ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }""",
    """      if (nAns && nAns.end === 1) return { ok: true, ja: nAns.ja + 'です。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }
    if (b === 2 && T[0].k === 'w' && ((PRON[T[0].w] && PRON[T[0].w].sub) || T[0].cap || NAME_JA[T[0].w]) && T[1].k === 'w' && /^(?:can|could|will)$/.test(T[1].w)) {
      const nAns2 = np(0, 1, {});
      if (nAns2 && nAns2.end === 1) return { ok: true, ja: nAns2.ja + 'は' + ({ can: 'できる', could: 'できた', will: 'そうする' })[T[1].w] + '。', sp: '', names: ['fixed'], sel: selMap(), unknown: UNK.slice(), idioms: USED.slice() };
      reset(tokens);
    }""")

# Everyone laughed, but I didn't. → 短い前半も対象に
rep("""      // She went to the party, but I didn't. → 彼女はパーティーに行ったが、私は行かなかった（did だけの省略は前の過去形動詞を補う）
      if (kBt > 0 && T[kBt + 1]""",
    """      // She went to the party, but I didn't. → 彼女はパーティーに行ったが、私は行かなかった（did だけの省略は前の過去形動詞を補う）
      const kBt2 = kBt > 0 ? kBt : T.findIndex((x, q) => q > 1 && isW(x, 'but') && isP(T[q - 1], ','));
      if (kBt2 > 0 && T[kBt2 + 1]""")
rep("""PRON[T[kBt + 1].w].sub && isW(T[kBt + 2], 'did') && isW(T[kBt + 3], 'not') && kBt + 4 === b && T[0].k === 'w' && T[0].w !== T[kBt + 1].w && !T.slice(0, kBt).some(""",
    """PRON[T[kBt2 + 1].w].sub && isW(T[kBt2 + 2], 'did') && isW(T[kBt2 + 3], 'not') && kBt2 + 4 === b && T[0].k === 'w' && T[0].w !== T[kBt2 + 1].w && !T.slice(0, kBt2).some(""")
rep("""T[kBt2 + 1] && T[kBt + 1].k === 'w' && PRON[T[kBt + 1].w] && PRON[T[kBt2 + 1].w].sub""",
    """T[kBt2 + 1] && T[kBt2 + 1].k === 'w' && PRON[T[kBt2 + 1].w] && PRON[T[kBt2 + 1].w].sub""")
rep("""        const qD = T.findIndex((x, q) => q > 0 && q < kBt - 1 && x.k === 'w'""",
    """        const qD = T.findIndex((x, q) => q > 0 && q < kBt2 - 1 && x.k === 'w'""")
rep("""          const r1D = translate1(T.slice(0, kBt - 1).map(""",
    """          const r1D = translate1(T.slice(0, kBt2 - 1).map(""")
rep("""          const objD = T.slice(qD + 1, kBt - 1).filter(""",
    """          const objD = T.slice(qD + 1, kBt2 - 1).filter(""")
rep("""          const t2D = tokenize(T[kBt + 1].w + ' did not ' + vD.lemma""",
    """          const t2D = tokenize(T[kBt2 + 1].w + ' did not ' + vD.lemma""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
