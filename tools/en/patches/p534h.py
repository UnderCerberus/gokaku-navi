import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# When students are doing research, on the other hand, they could … → 一方で、学生が研究をしているとき、…（文頭が従属接続詞・前置詞なら、挿入句を除いたあともコンマを残す読みを先に試す）
rep("""        const variants = [T.slice(a, x).concat(T.slice(x + len + 2, b)), T.slice(a, x + 1).concat(T.slice(x + len + 2, b))];""",
    """        const variants = [T.slice(a, x).concat(T.slice(x + len + 2, b)), T.slice(a, x + 1).concat(T.slice(x + len + 2, b))];
        if (T[a].k === 'w' && (!!SUB[T[a].w] || subAt(a, b)) && x > a + 2) variants.reverse();   // 従属節のあとの挿入句""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
