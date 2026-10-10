import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I thought it was something that took too much time and that I could always buy food …（最初の that を省いた that 節の並列: and that + 主語の代名詞）
rep("""    const cl = sentence(st0, lim, { sub: true, reported: !!mainPast });
    if (!cl) return fail(m);
    name('that-clause');""",
    """    if (!isW(T[j], 'that')) {
      for (let x = st0 + 2; x + 3 < lim; x++) {
        if (!(isW(T[x], 'and') && isW(T[x + 1], 'that') && T[x + 2] && T[x + 2].k === 'w' && PRON[T[x + 2].w] && PRON[T[x + 2].w].sub && T[x + 2].w !== 'that' && verbStart(x + 3))) continue;
        const xe = isP(T[x - 1], ',') ? x - 1 : x;
        const c1 = sentence(st0, xe, { sub: true }), c2 = c1 ? sentence(x + 2, lim, { sub: true }) : null;
        if (c1 && c2) {
          name('that-clause');
          const p1 = mainPast && c1.past && !c1.perfect ? false : undefined, p2 = mainPast && c2.past && !c2.perfect ? false : undefined;
          return { str: c1.out({ part: 'が', past: p1 }) + 'ということも、' + c2.out({ part: 'が', past: p2 }), end: lim, cl: c2, both: true };
        }
        fail(m);
        break;
      }
    }
    const cl = sentence(st0, lim, { sub: true, reported: !!mainPast });
    if (!cl) return fail(m);
    name('that-clause');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
