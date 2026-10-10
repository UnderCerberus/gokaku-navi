import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# found an umbrella left on a bench（目的語のあとの left は過去分詞。補語の形容詞「左」にしない）
rep("""    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L)) && !(tj && tj.k === 'w' && /^(?:back|home|away)$/.test(tj.w))) {""",
    """    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L)) && !(tj && tj.k === 'w' && /^(?:back|home|away)$/.test(tj.w)) && !isW(tj, 'left')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
