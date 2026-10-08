import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# One third of the students walk to school（分数 of ~ の数の一致は of のあとの名詞に従う）
rep("""          if (inner7) return { ja: inner7.ja + 'の' + fja, end: inner7.end, head: inner7.head, an: inner7.an, qof: 'の' + fja, frac: true };""",
    """          if (inner7) return { ja: inner7.ja + 'の' + fja, end: inner7.end, head: inner7.head, an: inner7.an, qof: 'の' + fja, frac: true, pl: !!inner7.pl || !!inner7.coord };""")

# Nine out of ten students passed → 10人中9人の生徒が合格した
rep("""    // one third (of ~) / two thirds / a quarter / three quarters（分数）""",
    """    // nine out of ten students → 10人中9人の生徒 / three out of five → 5つ中3つ
    if ((t.k === 'num' || NUMW[t.w] !== undefined) && seq(i + 1, ['out', 'of']) && i + 3 < lim && (T[i + 3].k === 'num' || NUMW[T[i + 3].w] !== undefined)) {
      const nOut = t.k === 'num' ? Number(t.w) : NUMW[t.w], mOut = T[i + 3].k === 'num' ? Number(T[i + 3].w) : NUMW[T[i + 3].w];
      if (Number.isFinite(nOut) && Number.isFinite(mOut) && nOut <= mOut) {
        const mO = mark();
        const innerO = i + 4 < lim && T[i + 4].k === 'w' && !PREP[T[i + 4].w] && !verbStart(i + 4) ? np1(i + 4, lim, Object.assign({}, o, { noPost: true })) : null;
        if (innerO && !innerO.pron) {
          const uO = innerO.an ? '人' : (COUNTER[innerO.head] || 'つ');
          return postMod({ ja: mOut + uO + '中' + nOut + uO + 'の' + innerO.ja.replace(/(?:人々|たち)$/, (m0) => (innerO.head === 'people' ? '人' : '')), end: innerO.end, head: innerO.head, an: innerO.an, pl: nOut > 1 }, lim, o);
        }
        fail(mO);
        if (!innerO) return postMod({ ja: mOut + 'のうち' + nOut, end: i + 4, head: 'fraction', pl: nOut > 1 }, lim, o);
      }
    }
    // one third (of ~) / two thirds / a quarter / three quarters（分数）""")

# The price is half as much as before → 価格は以前の半分だ
rep("""      if ((isW(T[k], 'as') || (isW(T[k], 'so') && vg.neg)) && k + 3 < lim) {
        const a3 = adjC(T[k + 1]);""",
    """      if (mult && isW(T[k], 'as') && (isW(T[k + 1], 'much') || isW(T[k + 1], 'many')) && isW(T[k + 2], 'as') && k + 3 < lim) {   // The price is half as much as before → 以前の半分だ
        const BEFM = { before: '以前', usual: 'いつも', last: '前回' };
        if (k + 4 === lim && BEFM[T[k + 3].w]) { name('as-as'); return fin(P(BEFM[T[k + 3].w] + mult.replace(/^の/, 'の') + 'だ', 'da'), lim, 'SVC', []); }
        const mHm = mark();
        const nHm = np(k + 3, lim, { noRel: true });
        if (nHm && nHm.end === lim) { name('as-as'); return fin(P(nHm.ja + mult + 'だ', 'da'), lim, 'SVC', []); }
        fail(mHm);
      }
      if ((isW(T[k], 'as') || (isW(T[k], 'so') && vg.neg)) && k + 3 < lim) {
        const a3 = adjC(T[k + 1]);""")

# a quarter of an hour → 15分
rep("""    if (seq(i, ['half', 'an', 'hour']) || seq(i, ['half', 'a', 'day']) || seq(i, ['half', 'a', 'year'])) return""",
    """    if (seq(i, ['a', 'quarter', 'of', 'an', 'hour'])) return { ja: '15分', end: i + 5, dur: true, instant: true, time: true, head: 'minutes' };   // a quarter of an hour → 15分
    if (seq(i, ['three', 'quarters', 'of', 'an', 'hour'])) return { ja: '45分', end: i + 5, dur: true, instant: true, time: true, head: 'minutes' };
    if (seq(i, ['half', 'an', 'hour']) || seq(i, ['half', 'a', 'day']) || seq(i, ['half', 'a', 'year'])) return""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
