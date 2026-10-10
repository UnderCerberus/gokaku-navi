import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# catch a yawn from family members and close friends than from strangers → 家族や親しい友達から（比較の than のあとの前置詞は「and + 名詞句 + 前置詞句」の目印にしない）
rep("""    for (let x = s; x < e; x++) { if (T[x].k === 'p') return false; if (T[x].k === 'w' && PREP[T[x].w] && T[x].w !== 'of' && T[x].w !== 'than') return true; }""",
    """    for (let x = s; x < e; x++) { if (T[x].k === 'p') return false; if (isW(T[x], 'than')) return false; if (T[x].k === 'w' && PREP[T[x].w] && T[x].w !== 'of') return true; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
