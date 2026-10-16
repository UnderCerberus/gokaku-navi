import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the technology will become cheaper as it improves → 進歩するにつれて（改善・進歩・悪化の変化の動詞の as も「〜につれて」。「良くなるので」にしない）
rep("""古くなる|経つ|上昇する|低下する)$/.test(sc.pred.s) ||""",
    """古くなる|経つ|上昇する|低下する|良くなる|悪くなる|改善する|向上する|進歩する|進化する|悪化する|上達する|成熟する|老いる)$/.test(sc.pred.s) ||""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
