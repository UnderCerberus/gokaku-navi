import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# for people living alone to … / for students who live far away to …（to の手前までに区切った名詞句は分詞・関係詞の修飾も取る）
rep("""        const n2 = np(k + 1, x, { noRel: true, noCoord: true, pp: true });
        if (n2 && n2.end === x) return { np: n2, end: x };""",
    """        let n2 = np(k + 1, x, { noRel: true, noCoord: true, pp: true });
        if (!(n2 && n2.end === x)) { fail(m); n2 = np(k + 1, x, { noCoord: true, pp: true }); }
        if (n2 && n2.end === x) return { np: n2, end: x };""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
