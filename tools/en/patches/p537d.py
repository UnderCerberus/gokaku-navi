import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# … more in winter than in summer, when the outside air is too hot to cool anything → …（夏は外の空気が暑すぎて何も冷やせない）（時の名詞 + コンマ + when は非制限の関係副詞: 主節の時の節にしない）
rep("""      const espS = pv.k === 'w' && /^(?:especially|particularly)$/.test(pv.w) && isP(T[j - 2], ',') && j - 2 > a + 1;""",
    """      if (s2.key === 'when' && isP(pv, ',') && j - 2 > a + 1 && T[j - 2].k === 'w' && /^(?:summer|winter|spring|autumn|fall|night|nights|morning|mornings|evening|evenings|weekend|weekends|season|seasons|century|decade|era|period|age|year|years|month|months|day|days|week|weeks|childhood|youth)$/.test(T[j - 2].w) && !T.slice(a, j - 2).some((x) => isW(x, 'when'))) {
        const mNr = mark();
        const mnNr = sentence(a, j - 1, o);
        const scNr = mnNr ? sentence(j + 1, b, { sub: true }) : null;
        if (mnNr && scNr) {
          const cNr = nounC(T[j - 2]);
          const tnNr = /^(?:century|decade|era|period|age|year|years|month|months|day|days|week|weeks|childhood|youth)$/.test(T[j - 2].w) || T[j - 3].k === 'num' || !!ORD[(T[j - 3] || {}).w] ? '当時' : (cNr && cNr.e ? en.jp.first(cNr.e.ja) : '');   // in the seventeenth century, when … → 当時は
          name('rel-adv');
          const nodeNr = Object.assign({}, mnNr);
          nodeNr.out = (y) => mnNr.out(y) + '（' + tnNr + 'は' + scNr.out({ part: 'が' }) + '）';
          return wrap(nodeNr);
        }
        fail(mNr);
      }
      const espS = pv.k === 'w' && /^(?:especially|particularly)$/.test(pv.w) && isP(T[j - 2], ',') && j - 2 > a + 1;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
