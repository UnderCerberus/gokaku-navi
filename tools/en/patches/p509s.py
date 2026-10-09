import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# argue that too much homework can harm A and leave B → that 節の中の助動詞 + 原形 A and 原形 B は that 節の中の並列（単文を先に試す）
rep("""      // I want to become a doctor and help sick people / My dream is to travel around the world and meet many people（to 不定詞 + and + 原形は不定詞の並列: 単文を先に試す）""",
    """      if (isCC && (w === 'and' || w === 'or') && je === j && rs === j + 1 && T[rs].k === 'w' && !!vc(T[rs], ['base']) && !vc(T[rs], ['past', '3sg']) && !PRON[T[rs].w] && DET[T[rs].w] === undefined &&
        T.slice(a, je).some((x, q) => isW(x, 'that') && T.slice(a + q + 1, je).some((y) => y.k === 'w' && MODAL[y.w]) && !T.slice(a + q + 1, je).some((y) => isP(y, ',') || (y.k === 'w' && (SUB[y.w] || isW(y, 'that')))))) {
        const mTm = mark();
        const wholeTm = clause(a, b, o);
        if (wholeTm) return wrap(wholeTm);
        fail(mTm);
      }
      // I want to become a doctor and help sick people / My dream is to travel around the world and meet many people（to 不定詞 + and + 原形は不定詞の並列: 単文を先に試す）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
