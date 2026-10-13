import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# is not the result of conscious decisions but of habits → 意識的な決定の結果ではなく、習慣の結果だ
# （not the X of A but of B: but のあとの of B は X を補って「B の X」。「結果ではないが、習慣のままだ」にしない）
rep("""        const b3 = np(a3.end + 1, lim, o);
        if (b3) { name('not-but'); return Object.assign({}, b3, { ja: a3.ja + 'ではなく' + b3.ja, end: b3.end, coord: true }); }""",
    """        const b3 = np(a3.end + 1, lim, o);
        if (b3) { name('not-but'); return Object.assign({}, b3, { ja: a3.ja + 'ではなく' + b3.ja, end: b3.end, coord: true }); }
        if (isW(T[a3.end + 1], 'of') && a3.end + 2 < lim) {
          const kOfA = T.slice(i + 1, a3.end).findIndex((x) => isW(x, 'of'));
          const hOfA = kOfA > 0 ? np1(i + 1, i + 1 + kOfA, { noPost: true, noRel: true, noCoord: true }) : null;
          const nOfB = hOfA && hOfA.end === i + 1 + kOfA ? np(a3.end + 2, lim, o) : null;
          if (nOfB) { name('not-but'); return Object.assign({}, nOfB, { ja: a3.ja + 'ではなく、' + nOfB.ja + 'の' + hOfA.ja.replace(/^(?:その|1つの|ある)/, ''), end: nOfB.end, coord: true, head: hOfA.head }); }
        }""")

# be の補語の not A of X but of Y（is not the result of … but of habits）
rep("""      if (d1 && d2) { name('not-but'); vg.neg = false; return fin(P(d1.ja + 'ではなく' + d2.ja + 'だ', 'da'), tail(d2.end, lim, st, o, vg)); }""",
    """      if (d1 && !d2 && k2d + 1 < lim && isW(T[k2d], 'of')) {
        const kOfD = T.slice(i, d1.end).findIndex((x) => isW(x, 'of'));
        const hOfD = kOfD > 0 ? np1(i, i + kOfD, { noPost: true, noRel: true, noCoord: true }) : null;
        const nOfD = hOfD && hOfD.end === i + kOfD ? np(k2d + 1, lim, { noRel: true }) : null;
        if (nOfD) d2 = { ja: '、' + nOfD.ja + 'の' + hOfD.ja.replace(/^(?:その|1つの|ある)/, ''), end: nOfD.end };
      }
      if (d1 && d2) { name('not-but'); vg.neg = false; return fin(P(d1.ja + 'ではなく' + d2.ja + 'だ', 'da'), tail(d2.end, lim, st, o, vg)); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
