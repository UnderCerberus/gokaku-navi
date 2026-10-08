import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a combination of remote and office work → リモートワークとオフィスでの勤務の組み合わせ（形容詞 and 名詞 + 名詞 は主要部を両方に配る）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 5 && !tokens.__distH) {
      const kDh = T.findIndex((x, q) => q >= 1 && q + 3 < b && x.k === 'w' && !!adjC(x) && !nounC(x) && isW(T[q + 1], 'and') && T[q + 2].k === 'w' && !!nounC(T[q + 2]) && !adjC(T[q + 2]) && T[q + 3].k === 'w' && !!nounC(T[q + 3]) && !vc(T[q + 3], ['3sg', 'past']) && (q + 4 >= b || T[q + 4].k !== 'w' || !nounC(T[q + 4]) || PREP[T[q + 4].w] || !!MODAL[T[q + 4].w] || !!BE[T[q + 4].w]) && T[q - 1] && T[q - 1].k === 'w' && (isW(T[q - 1], 'of') || DET[T[q - 1].w] !== undefined || PREP[T[q - 1].w]));
      if (kDh > 0) {
        const tDh = tokens.slice(0, kDh + 1).concat([Object.assign({}, tokens[kDh + 3])], tokens.slice(kDh + 1, kDh + 4)).concat(tokens.slice(kDh + 4)).map((x, k) => Object.assign({}, x, { i: k }));
        tDh.__distH = true;
        const rDh = translate1(tDh);
        reset(tokens);
        if (rDh && rDh.ok) return rDh;
      }
    }
    // 呼びかけ: Ken, come here.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
