import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the entire town → 町全体（the whole と同じ。全体の町 にしない）
rep("""    if (t.w === 'the' && isW(T[i + 1], 'whole') && i + 2 < lim && T[i + 2].k === 'w' && nounC(T[i + 2]) && !PREP[T[i + 2].w]) {""",
    """    if (t.w === 'the' && (isW(T[i + 1], 'whole') || isW(T[i + 1], 'entire')) && i + 2 < lim && T[i + 2].k === 'w' && nounC(T[i + 2]) && !PREP[T[i + 2].w]) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
