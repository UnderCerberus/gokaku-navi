import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Animals like dogs and cats are popular pets → 犬とネコのような動物は人気のあるペットだ（複数名詞 + like + A and B + be は such as と同じ）
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    {
      const kLs = T.findIndex((x, q) => q >= 1 && q <= 3 && isW(x, 'like') && T[q - 1].k === 'w' && !!cand(T[q - 1], '名', ['pl']) && !PRON[T[q - 1].w] && !T.slice(0, q - 1).some((y) => y.k === 'w' && (!!vc(y, ['base', '3sg', 'past']) && !nounC(y) && DET[y.w] === undefined)));
      if (kLs > 0) {
        const kAs = T.findIndex((x, q) => q > kLs + 1 && isW(x, 'and'));
        const kVs = kAs > 0 ? T.findIndex((x, q) => q > kAs + 1 && x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || !!HAVE[x.w])) : -1;
        if (kVs > 0 && kVs <= kAs + 3) {
          const saT = tokenize('such as').filter((x) => x.k === 'w');
          const tSa = T.slice(0, kLs).concat(saT, T.slice(kLs + 1)).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
          const rSa = translate1(tSa);
          reset(tokens);
          if (rSa && rSa.ok) return rSa;
        }
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
