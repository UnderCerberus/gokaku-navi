import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base'])) && !(T[x + 2] && T[x + 2].k === 'w' && (DET[T[x + 2].w] !== undefined || /^(?:it|them|him|her|us|me)$/.test(T[x + 2].w)) && isW(T[v0 + 1], 'it'))) return null;   // can choose to stay or leave（to 不定詞の中の並列）/ can make it harder to concentrate and increase the risk は述語の並列""",
    """        if (!cuts.length && !isP(T[x - 1], ',') && T.slice(v0 + 1, x).some((y, q) => isW(y, 'to') && T[v0 + 2 + q] && T[v0 + 2 + q].k === 'w' && !!vc(T[v0 + 2 + q], ['base']))) return null;   // can choose to stay or leave（to 不定詞の中の並列）""")

rep("""    ja = ja.replace(/([^、。]{1,20}?)に(夜|一晩)を(必要とする|とる)/, '1晩に$1を$3')""",
    """    ja = ja.replace(/([^、。は]{1,20}?)に(夜|一晩)を(必要とする|とる)/, '1晩に$1を$3')""")

# Lack of sleep can make it harder to concentrate and increase the risk of illness → 集中しにくくし、病気の危険を高めることがある（S + 助動詞 + 述語1 and 述語2 を 2 文に分けて読む）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 8 && !tokens.__mdSplit) {
      const kMd = T.findIndex((x, q) => q >= 1 && x.k === 'w' && /^(?:can|could|may|might|will|would|should|must)$/.test(x.w));
      const kAn = kMd > 0 ? T.findIndex((x, q) => q > kMd + 3 && isW(x, 'and') && T[q + 1] && T[q + 1].k === 'w' && !!vc(T[q + 1], ['base']) && !nounC(T[q + 1]) && T[q + 2] && T[q + 2].k === 'w' && DET[T[q + 2].w] !== undefined && T.slice(kMd + 1, q).some((y) => isW(y, 'to'))) : -1;
      if (kMd > 0 && kAn > 0) {
        const tM1 = tokens.slice(0, kAn).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));
        const tM2 = tokens.slice(0, kMd + 1).concat(tokens.slice(kAn + 1)).map((x, k) => Object.assign({}, x, { i: k }));
        tM1.__mdSplit = true; tM2.__mdSplit = true;
        const rM1 = translate1(tM1), rM2 = rM1 && rM1.ok ? translate1(tM2) : null;
        reset(tokens);
        if (rM1 && rM1.ok && rM2 && rM2.ok) {
          const sj2 = /^(.+?)は/.exec(rM2.ja);
          const p1 = rM1.ja.replace(/。$/, '').replace(/(?:ことがある|ことができる|かもしれない|だろう)$/, '').replace(/くする$/, 'くし').replace(/する$/, 'し').replace(/([うくぐすつぬぶむる])$/, (m0) => ({ 'う': 'い', 'く': 'き', 'ぐ': 'ぎ', 'す': 'し', 'つ': 'ち', 'ぬ': 'に', 'ぶ': 'び', 'む': 'み', 'る': '' })[m0] || m0);
          if (sj2) return Object.assign({}, rM2, { ja: p1 + '、' + rM2.ja.slice(sj2[0].length) });
        }
      }
    }
    // 呼びかけ: Ken, come here.""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
