import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Of the roughly seven thousand languages spoken in the world today, nearly half are … → 今日世界で話されているおよそ7000の言語のうち、ほぼ半分は…
# （文頭の of + 名詞句 + コンマ + 数量の主語は「〜のうち、」。「〜の、」にしない）
rep("""      if (k < 0 && seq(a, ['more', 'than']) && a + 3 < b) {
        const cMt = T.findIndex((x, q) => q > a + 2 && q < b - 1 && isP(x, ','));""",
    """      if (k < 0 && isW(T[a], 'of') && a + 2 < b) {
        const cOf = T.findIndex((x, q) => q > a + 1 && q < b - 1 && isP(x, ','));
        const qOf = cOf > 0 ? T[cOf + 1] : null;
        if (qOf && (qOf.k === 'num' || (qOf.k === 'w' && (NUMW[qOf.w] !== undefined || /^(?:half|most|many|some|few|all|none|one|several|each|both|nearly|almost|about|roughly|over|only|more|the|these|those)$/.test(qOf.w))))) {
          const mOf = mark();
          const nOf = np(a + 1, cOf, {});
          if (nOf && nOf.end === cOf) { st0.other.push(nOf.ja + 'のうち'); k = cOf; } else fail(mOf);
        }
      }
      if (k < 0 && seq(a, ['more', 'than']) && a + 3 < b) {
        const cMt = T.findIndex((x, q) => q > a + 2 && q < b - 1 && isP(x, ','));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
