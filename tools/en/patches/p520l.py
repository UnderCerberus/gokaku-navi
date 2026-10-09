import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The problem with relying on test scores is that they fail to measure … → それらが（fail / tend は物の主語にも使うので、人の動作の一覧から外す）
rep("""|admit|argue|claim|complain|worry|fail|manage|refuse|realize|understand|spend|waste|eat|sleep|marry|vote|work|live|travel|visit|move|graduate|retire|apply|hire|teach|treat|raise|struggle|suffer|enjoy|tend)$/.test(cv.lemma)) return 'an'; }""",
    """|admit|argue|claim|complain|worry|manage|refuse|realize|understand|spend|waste|eat|sleep|marry|vote|work|live|travel|visit|move|graduate|retire|apply|hire|teach|treat|raise|struggle|suffer|enjoy)$/.test(cv.lemma)) return 'an'; }   // fail / tend は物の主語にも使う（tests … they fail to measure）""")

# relying solely on test scores is that they …（名詞 + 3 単現にもなる複数形の直後が be・助動詞なら、複数形は名詞）
rep("""      if (vc(t, ['3sg', 'past']) && T[x - 1] && T[x - 1].k === 'w' && ((PRON[T[x - 1].w] && PRON[T[x - 1].w].sub && DET[T[x - 1].w] === undefined) || isW(T[x - 1], 'to') || (nounC(T[x - 1]) && !adjC(T[x - 1]) && DET[T[x - 1].w] === undefined) ||""",
    """      if (vc(t, ['3sg', 'past']) && T[x - 1] && T[x - 1].k === 'w' && ((PRON[T[x - 1].w] && PRON[T[x - 1].w].sub && DET[T[x - 1].w] === undefined) || isW(T[x - 1], 'to') || (nounC(T[x - 1]) && !adjC(T[x - 1]) && DET[T[x - 1].w] === undefined && !(T[x + 1] && T[x + 1].k === 'w' && (BE[T[x + 1].w] || MODAL[T[x + 1].w]))) ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
