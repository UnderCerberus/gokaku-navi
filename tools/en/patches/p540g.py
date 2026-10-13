import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# It is easier to read this book → この本を読むことはより簡単だ / It is more important to sleep well → よく眠ることはより重要だ
# （It is + 比較級 + to 不定詞（than なし）は比較の意味を残す。「簡単だ」だけにしない・more を「もっと多い」と読んで「眠るために」にしない）
rep("""    const a1 = adjC(T[k]);
    if (a1 && k + 1 < b && !(nounC(T[k + 1]) && !PREP[T[k + 1].w])) {
      const f = en.jp.adj(a1.e.ja);""",
    """    const noThanI = !T.some((x) => isW(x, 'than'));
    if (k < b - 2 && isW(T[k], 'more') && noThanI && adjC(T[k + 1]) && adjC(T[k + 1]).form === 'base' && (isW(T[k + 2], 'to') || isW(T[k + 2], 'for') || isW(T[k + 2], 'that'))) { deg += 'より'; k++; }
    const a1 = adjC(T[k]);
    if (a1 && a1.form === 'comp' && noThanI && !/^(?:better|worse|more|less|further|farther|later|earlier)$/.test(T[k].w) && k + 1 < b && (isW(T[k + 1], 'to') || isW(T[k + 1], 'for'))) deg = 'より' + deg;
    if (a1 && k + 1 < b && !(nounC(T[k + 1]) && !PREP[T[k + 1].w])) {
      const f = en.jp.adj(a1.e.ja);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
