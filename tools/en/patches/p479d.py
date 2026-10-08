import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More people than ever use the internet → かつてないほど多くの人々
rep("""    // for at least an hour / at most ten minutes → 少なくとも1時間 / 多くても10分
""", """    // More people than ever use the internet → かつてないほど多くの人々がインターネットを使う
    if (isW(t, 'more') && i + 3 < lim && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && !o.noApprox) {
      let kTe = -1;
      for (let q = i + 2; q + 1 < lim && q < i + 6; q++) { if (isW(T[q], 'than') && isW(T[q + 1], 'ever')) { kTe = q; break; } if (T[q].k === 'p') break; }
      if (kTe > 0) {
        const mTe = mark();
        const nTe = np1(i + 1, kTe, Object.assign({}, o, { noRel: true }));
        if (nTe && nTe.end === kTe) return Object.assign({}, nTe, { ja: 'かつてないほど多くの' + nTe.ja, end: kTe + 2, pl: true });
        fail(mTe);
      }
    }
    // for at least an hour / at most ten minutes → 少なくとも1時間 / 多くても10分
""")

rep("""    ja = ja.replace(/月で歩い/g, '月面を歩い')""",
    """    ja = ja.replace(/(?:はるかに)?多くの([^、。をがは]{1,8})にかつてないほど/g, 'かつてないほど多くの$1に');   // available to far more people than ever before → かつてないほど多くの人々に
    ja = ja.replace(/月で歩い/g, '月面を歩い')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
