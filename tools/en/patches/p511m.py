import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many of the fruits and vegetables we eat → 私たちが食べる果物と野菜の多く（of のあとの名詞の並列 + 関係詞節も量の語の中に入れる）
rep("""      if (QOF[t.w]) {
        const inner2 = np1(i + 2, lim, o);""",
    """      if (QOF[t.w]) {
        let inner2 = np1(i + 2, lim, o);
        if (inner2 && inner2.end + 1 < lim && (isW(T[inner2.end], 'and') || isW(T[inner2.end], 'or')) && T[inner2.end + 1].k === 'w' && !!nounC(T[inner2.end + 1]) && !PRON[T[inner2.end + 1].w] && DET[T[inner2.end + 1].w] === undefined) {
          const mI2 = mark();
          const nc2 = np1(inner2.end + 1, lim, Object.assign({}, o, { noRel: true }));
          if (nc2 && !nc2.det) {
            const joined = { ja: inner2.ja + (isW(T[inner2.end], 'or') ? 'か' : 'と') + nc2.ja, end: nc2.end, head: nc2.head, an: inner2.an && nc2.an, pl: true, coord: true };
            const withRel = nc2.end < lim ? postMod(Object.assign({}, joined), lim, o) : joined;
            inner2 = withRel && withRel.end >= joined.end ? Object.assign({}, withRel, { coord: true, pl: true }) : joined;
          } else fail(mI2);
        }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
