import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for a decade / two decades → 10年・20年（「1十年」「2十年」にしない）
rep("""      let node0 = { ja: (num ? det : '') + n1 + UNIT[nom.c.lemma], end: nom.end,""",
    """      const decJa = nom.c.lemma === 'decade' && /^[0-9]+$/.test(n1) ? String(Number(n1) * 10) + '年' : n1 + UNIT[nom.c.lemma];   // more than a decade → 10年以上
      let node0 = { ja: (num ? det : '') + decJa, end: nom.end,""")

# a healthy diet alone is not enough（that 節の中: 「だけでが」にしない → だけでは）
rep("""      return Object.assign({}, first, { ja: first.ja + 'だけで', end: first.end + 1, pron: undefined });""",
    """      return Object.assign({}, first, { ja: first.ja + 'だけでは', end: first.end + 1, pron: undefined, bare: true });""")

# not only A but also B and C（B の側の並列も読む: our mood and ability to concentrate）
rep("""      const a2 = np1(i + 2, lim, o);
      if (a2 && isW(T[a2.end], 'but')) {
        const b2 = np1(isW(T[a2.end + 1], 'also') ? a2.end + 2 : a2.end + 1, lim, o);""",
    """      const a2 = np1(i + 2, lim, o);
      if (a2 && isW(T[a2.end], 'but')) {
        const kB2 = isW(T[a2.end + 1], 'also') ? a2.end + 2 : a2.end + 1;
        let b2 = np1(kB2, lim, o);
        if (b2 && b2.end < lim && (isW(T[b2.end], 'and') || isW(T[b2.end], 'or'))) { const mB3 = mark(); const b3 = np(kB2, lim, o); if (b3 && b3.end > b2.end) b2 = b3; else fail(mB3); }""")

# for anyone to … / Anyone can … → 誰でも
rep("""    // the next / the last / the same（名詞を省いた言い方）""",
    """    if (/^(?:anyone|anybody)$/.test(t.w) && i > 0 && isW(T[i - 1], 'for') && isW(T[i + 1], 'to')) return { ja: '誰でも', end: i + 1, an: true, pron: 'anyone', bare: true };   // made it possible for anyone to publish → 誰でも〜できる
    // the next / the last / the same（名詞を省いた言い方）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
