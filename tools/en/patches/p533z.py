import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Her last class is on the twenty-eighth / on the 28th of May → 28日に・5月28日に（on the + 序数は日付）
rep("""    if (--BUDGET < 0) return null;
    const m = mark();
    if (t.w === 'all' && isW(T[i + 1], 'through') && i + 2 < lim) {""",
    """    if (--BUDGET < 0) return null;
    const m = mark();
    if (t.w === 'on' && isW(T[i + 1], 'the') && i + 2 < lim && T[i + 2]) {
      const dOrd = (x) => {
        if (!x) return 0;
        if (x.k === 'num') { const mN = /^(\\d{1,2})(?:st|nd|rd|th)$/.exec(String(x.s || x.w)); return mN ? Number(mN[1]) : 0; }
        if (x.k !== 'w') return 0;
        const U = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8, ninth: 9, tenth: 10, eleventh: 11, twelfth: 12, thirteenth: 13, fourteenth: 14, fifteenth: 15, sixteenth: 16, seventeenth: 17, eighteenth: 18, nineteenth: 19, twentieth: 20, thirtieth: 30 };
        if (U[x.w]) return U[x.w];
        const mW = /^(twenty|thirty)-(first|second|third|fourth|fifth|sixth|seventh|eighth|ninth)$/.exec(x.w);
        return mW ? (mW[1] === 'twenty' ? 20 : 30) + U[mW[2]] : 0;
      };
      const dV = dOrd(T[i + 2]);
      const MON = { january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8, september: 9, october: 10, november: 11, december: 12 };
      if (dV >= 1 && dV <= 31 && (i + 3 >= lim || T[i + 3].k === 'p' || (T[i + 3].k === 'w' && !nounC(T[i + 3])) || (isW(T[i + 3], 'of') && T[i + 4] && MON[T[i + 4].w]))) {
        const monV = isW(T[i + 3], 'of') && T[i + 4] && MON[T[i + 4].w] ? MON[T[i + 4].w] : 0;
        const jaD = (monV ? monV + '月' : '') + dV + '日';
        return { ja: jaD + 'に', adn: jaD + 'の', end: monV ? i + 5 : i + 3, kind: 'time', prep: 'on', obj: { ja: jaD, time: true, end: monV ? i + 5 : i + 3 } };
      }
    }
    if (t.w === 'all' && isW(T[i + 1], 'through') && i + 2 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
