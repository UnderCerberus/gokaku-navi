import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""'wet paint': 'ペンキ塗りたて', """,
    """'wet paint': 'ペンキ塗りたて', 'we will see what happens': 'どうなるか様子を見よう', 'let us see what happens': 'どうなるか様子を見よう', 'let us wait and see what happens': 'どうなるか様子を見よう', """)

rep("""    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""",
    """    if (tokens.some((x) => x.w === 'coming') && tokens.some((x, q) => x.w === 'down' && tokens[q + 1] && tokens[q + 1].w === 'with')) ja = ja.replace(/風邪をひいて(い|お)/g, '風邪をひきかけて$1');   // I think I'm coming down with a cold → 風邪をひきかけていると思う
    ja = ja.replace(/注意深くなる必要/g, '気をつける必要')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
