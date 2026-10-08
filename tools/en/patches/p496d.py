import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# than it was ten years ago / than it was in the past / than it was last year → 10年前より・以前より・昨年より
rep("""  function thanEllipsis(i, lim, mainSj) {
    if (i >= lim || lim - i > 5) return null;""",
    """  function thanEllipsis(i, lim, mainSj) {
    if (i < lim && lim - i <= 8 && lim - i >= 3) {
      let xb = -1;
      for (let x = i + 1; x < lim - 1; x++) if (T[x].k === 'w' && (BE[T[x].w] || DO[T[x].w] || MODAL[T[x].w] || HAVE[T[x].w])) { xb = x; break; }
      if (xb > i) {
        const mT = mark();
        let tj = null;
        if (isW(T[lim - 1], 'ago') && lim - 1 > xb + 1) { const nA = np(xb + 1, lim - 1, { noRel: true, noCoord: true }); if (nA && nA.end === lim - 1) tj = nA.ja.replace(/間$/, '') + '前'; }
        else if (seq(xb + 1, ['in', 'the', 'past']) && xb + 4 === lim) tj = '以前';
        else if (xb + 3 === lim && isW(T[xb + 1], 'last') && /^(?:year|month|week|time|summer|winter|spring)$/.test(T[xb + 2].w || '')) tj = ({ year: '昨年', month: '先月', week: '先週', time: '前回', summer: '去年の夏', winter: '去年の冬', spring: '去年の春' })[T[xb + 2].w];
        else if (xb + 2 === lim && /^(?:yesterday|before|once)$/.test(T[xb + 1].w || '')) tj = ({ yesterday: '昨日', before: '以前', once: 'かつて' })[T[xb + 1].w];
        if (tj) {
          const sjT = subject(i, xb);
          if (sjT && sjT.end === xb) return sjT.pron && (sjT.pron === 'it' || (mainSj && samePerson(mainSj.pron, sjT.pron))) ? tj : tj + 'の' + sjT.ja;
        }
        fail(mT);
      }
    }
    if (i >= lim || lim - i > 5) return null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
