import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# catch a yawn from friends / catch yawns → あくびがうつる（catch + あくび・笑い → うつる。つかまえる にしない）
rep("""    'take|measure measures step steps|を|講じる',""",
    """    'take|measure measures step steps|を|講じる',
    'catch|yawn yawns laugh laughter|が|うつる',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
