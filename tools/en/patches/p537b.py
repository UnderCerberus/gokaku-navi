import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# More than the skills I gained, I will remember … / More than anything, … / More than money, health is … → 得た技術よりも、・何よりも、・お金よりも、（文頭の More than + 名詞句 + コンマ）
rep("""      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than']) || seq(a, ['all', 'through'])) && T[a].w !== 'to') {""",
    """      if (k < 0 && seq(a, ['more', 'than']) && a + 3 < b) {
        const cMt = T.findIndex((x, q) => q > a + 2 && q < b - 1 && isP(x, ','));
        if (cMt > 0) {
          const mMt = mark();
          const nMt = np(a + 2, cMt, {});
          if (nMt && nMt.end === cMt) { st0.other.push((/^(?:anything|everything)$/.test(nMt.pron || '') ? '何' : nMt.ja) + 'よりも'); k = cMt; } else fail(mMt);
        }
      }
      if (k < 0 && T[a].k === 'w' && (PREP[T[a].w] || mprepAt(a) || seq(a, ['rather', 'than']) || seq(a, ['all', 'through'])) && T[a].w !== 'to') {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
