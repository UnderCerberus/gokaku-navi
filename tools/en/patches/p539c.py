import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the roughly seven thousand languages spoken in the world today → 今日世界で話されているおよそ7000の言語（roughly + 数 → 約。the + 概数の副詞 + 数も名詞句）
rep("""    if (/^(?:about|around|approximately|nearly|almost|over|only|just)$/.test(t.w) && i + 1 < lim && !o.noApprox) {
      const nxn = T[i + 1];""",
    """    if (t.w === 'the' && i + 2 < lim && !o.noApprox && T[i + 1].k === 'w' && /^(?:roughly|about|around|approximately|nearly|almost|over)$/.test(T[i + 1].w) && (T[i + 2].k === 'num' || NUMW[T[i + 2].w] !== undefined)) {
      const mTr = mark();
      const nTr = np1(i + 1, lim, o);
      if (nTr && nTr.num) return Object.assign({}, nTr, { det: 'the' });
      fail(mTr);
    }
    if (/^(?:about|around|approximately|roughly|nearly|almost|over|only|just)$/.test(t.w) && i + 1 < lim && !o.noApprox) {
      const nxn = T[i + 1];""")
rep("""          const AP = { about: ['約', ''], around: ['約', ''], approximately: ['約', ''], nearly: ['ほぼ', ''],""",
    """          const AP = { about: ['約', ''], around: ['約', ''], approximately: ['約', ''], roughly: ['およそ', ''], nearly: ['ほぼ', ''],""")

# About thirty students who live in Tokyo came → 東京に住んでいる約30人の学生（概数の語は数の直前に置く。「約東京に住んでいる」にしない）
rep("""          return Object.assign({}, inn, { ja: AP[t.w][0] + inn.ja + AP[t.w][1] });
        }
        fail(m);""",
    """          const nJaAp = inn.num && inn.num.ja ? String(inn.num.ja) : '';
          const kNjAp = nJaAp ? inn.ja.lastIndexOf(nJaAp) : -1;
          if (kNjAp > 0 && /^(?:about|around|approximately|roughly|nearly|almost|over)$/.test(t.w) && /[るたい]$/.test(inn.ja.slice(0, kNjAp))) return Object.assign({}, inn, { ja: inn.ja.slice(0, kNjAp) + AP[t.w][0] + inn.ja.slice(kNjAp) + AP[t.w][1] });
          return Object.assign({}, inn, { ja: AP[t.w][0] + inn.ja + AP[t.w][1] });
        }
        fail(m);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
