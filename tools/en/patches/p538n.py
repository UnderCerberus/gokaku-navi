import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# leaves and branches absorb some of the sound → 音の一部を吸収する（some of + 単数の名詞（数えない・ひとかたまりのもの）は「の一部」。「音のいくつか」にしない）
rep("""          const suf = t.w === 'one' && inner2.an ? 'の1人' : (inner2.an && QOF_AN[t.w] ? QOF_AN[t.w] : QOF[t.w]);""",
    """          const suf = t.w === 'one' && inner2.an ? 'の1人' : (inner2.an && QOF_AN[t.w] ? QOF_AN[t.w] : (t.w === 'some' && !inner2.pl && !inner2.coord && !inner2.pron && !inner2.num && inner2.head && !/s$/.test(inner2.head) ? 'の一部' : QOF[t.w]));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
