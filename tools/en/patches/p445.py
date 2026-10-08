import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# serious health problems and even death → 深刻な健康問題、さらには死（名詞句の and even は even を外して読み、さらには を補う）
rep("""    // 呼びかけ: Ken, come here.""",
    """    if (b > 5 && !tokens.__andEven) {
      const kAe = T.findIndex((x, q) => q >= 2 && isW(x, 'and') && isW(T[q + 1], 'even') && T[q + 2] && T[q + 2].k === 'w' && (!!nounC(T[q + 2]) || DET[T[q + 2].w] !== undefined) && !vc(T[q + 2], ['base', '3sg', 'past']) && T[q - 1] && T[q - 1].k === 'w' && !!nounC(T[q - 1]));
      if (kAe > 0) {
        const tAe = tokens.slice(0, kAe + 1).concat(tokens.slice(kAe + 2)).map((x, k) => Object.assign({}, x, { i: k }));
        tAe.__andEven = true;
        const rAe = translate1(tAe);
        reset(tokens);
        if (rAe && rAe.ok) {
          const nE = (T[kAe + 2].s || T[kAe + 2].w);
          return Object.assign({}, rAe, { ja: rAe.ja.replace(/([^、。]{2,})と([^、。と]{1,6}?)(を|が|に)/, (m0, a0, b0, c0) => a0 + '、さらには' + b0 + c0) });
        }
      }
    }
    // 呼びかけ: Ken, come here.""")

rep("""    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい');""",
    """    ja = ja.replace(/人々でいっぱい/g, '人でいっぱい').replace(/(?:自分自身|自分)の(?:かばん|袋|バッグ)(と|や)(?:自分自身の)?(?:びん|ボトル|水筒)/g, 'マイバッグ$1マイボトル');   // bringing their own bags and bottles → マイバッグとマイボトル""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
