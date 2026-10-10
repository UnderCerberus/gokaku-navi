import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It only takes a single message from a friend to break …（it takes + 名詞句 + 前置詞句 + to 不定詞: 前置詞句も名詞句にかける）
rep("""      if (n2 && isW(T[n2.end], 'to') && n2.end + 1 < b) {
        const inf = vpNonfin(n2.end + 1, b, 'base', { subj: who });""",
    """      if (n2 && n2.end + 3 < b && T[n2.end].k === 'w' && !!PREP[T[n2.end].w] && !isW(T[n2.end], 'to') && !isW(T[n2.end], 'for')) {
        const mPq = mark();
        const pPq = parsePP(n2.end, b, { noRel: true });
        if (pPq && pPq.adn && isW(T[pPq.end], 'to') && T[pPq.end + 1] && !!vc(T[pPq.end + 1], ['base'])) n2 = Object.assign({}, n2, { ja: pPq.adn + n2.ja, end: pPq.end }); else fail(mPq);
      }
      if (n2 && isW(T[n2.end], 'to') && n2.end + 1 < b) {
        const inf = vpNonfin(n2.end + 1, b, 'base', { subj: who });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
