import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the evidence suggests that the line between humans and other animals is not as clear … → 人間と他の動物の間の線が…ことを示唆する
# （and のあとの「複数の名詞 + is / was / has」は数が合わないので、そこで文を並列に分けない）
rep("""        const ingAfterProg = /^(?:and|or|but)$/.test(w) && !!left.subj""",
    """        let plIsR = false;
        if (/^(?:and|or)$/.test(w) && T[rs] && T[rs].k === 'w' && !(PRON[T[rs].w] && PRON[T[rs].w].sub)) {
          const mPi = mark();
          const nPi = np(rs, b, { noRel: true, noCoord: true });
          plIsR = !!nPi && !!nPi.pl && !nPi.coord && !nPi.pron && !nPi.num && T[nPi.end] && T[nPi.end].k === 'w' && /^(?:is|was|has|does|isn't|wasn't|hasn't|doesn't)$/.test(T[nPi.end].w);
          fail(mPi);
        }
        const ingAfterProg = /^(?:and|or|but)$/.test(w) && !!left.subj""")
rep("""|| modalStart || ingAfterProg ? null : sen""",
    """|| modalStart || ingAfterProg || plIsR ? null : sen""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
