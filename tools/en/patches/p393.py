import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is important not to give up → あきらめないことが重要だ（It is + 形容詞 + not to do）
rep("""    // Hi, Ken. → こんにちは、ケン""",
    """    if (isW(T[0], 'it') && T[1] && /^(?:is|was|'s)$/.test(T[1].w || '') && b > 5) {
      const kNt = T.findIndex((x, q) => q >= 3 && q <= 5 && isW(x, 'not') && isW(T[q + 1], 'to') && T[q + 2] && T[q + 2].k === 'w' && !!vc(T[q + 2], ['base']));
      if (kNt > 0 && T.slice(2, kNt).some((x) => !!adjC(x)) && !T.slice(2, kNt).some((x) => /^(?:better|best)$/.test(x.w || ''))) {
        const tNt = T.filter((x, q) => q !== kNt).map((x, k) => Object.assign({}, x, { i: k, first: k === 0 }));
        const rNt = translate1(tNt);
        reset(tokens);
        if (rNt && rNt.ok) {
          const jaNt = rNt.ja.replace(/^(.*?)([一-龠ァ-ヶー]+する|[一-龠][ぁ-ん]{0,4}(?:る|う|く|ぐ|す|つ|ぬ|ぶ|む))(ことは|のは|ことが)/, (m0, a0, v0) => { try { const pNt = P(v0); return verbal(pNt) ? a0 + pNt.aux('neg').plain() + 'ことが' : m0; } catch (eNt) { return m0; } });
          if (jaNt !== rNt.ja) return Object.assign({}, rNt, { ja: jaNt, names: (rNt.names || []).concat(['it-to']) });
        }
      }
    }
    // Hi, Ken. → こんにちは、ケン""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
