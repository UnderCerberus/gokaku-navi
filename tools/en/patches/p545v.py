import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# taken from almost the same spot → ほとんど同じ場所から / exactly the same size → まったく同じ大きさ
# （almost / nearly / exactly + the same / whole / opposite + 名詞は名詞句。前置詞のあとでも読む）
rep("""    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む""",
    """    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    if (t.k === 'w' && /^(?:almost|nearly|exactly|virtually|practically|roughly)$/.test(t.w) && isW(T[i + 1], 'the') && T[i + 2] && /^(?:same|whole|entire|opposite)$/.test(T[i + 2].w || '') && i + 3 < lim) {
      const mAl = mark();
      const nAl = np1(i + 1, lim, o);
      if (nAl) return Object.assign({}, nAl, { ja: (({ exactly: 'まったく', roughly: 'だいたい' })[t.w] || 'ほとんど') + nAl.ja.replace(/^その/, ''), end: nAl.end });
      fail(mAl);
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
