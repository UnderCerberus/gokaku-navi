import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I could not stop crying as I walked back to our seats → 席に歩いて戻っていたとき、泣くのをやめられなかった（歩いて戻る・帰るも続いている動作の as。「戻ったので」にしない）
rep("""|働く|遊ぶ|座る|登る|乗る|踊る|歌う|勉強する)$/.test(sc.pred.plain()))) { const sA = S('attr', true);""",
    """|働く|遊ぶ|座る|登る|乗る|踊る|歌う|勉強する|歩いて戻る|歩いて帰る|走って戻る|走って帰る|歩いて行く|歩いて来る)$/.test(sc.pred.plain()))) { const sA = S('attr', true);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
