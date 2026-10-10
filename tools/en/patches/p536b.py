import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# did not reduce how often they yawned / change how people think → どれくらい頻繁に…かを減らさなかった（疑問詞節を目的語にとる動詞: reduce / increase / change / improve / shape / limit / plan）
rep("""  const WHV = set('know wonder ask tell understand remember recall decide explain see show learn consider discuss i""",
    """  const WHV = set('reduce increase change improve shape limit plan know wonder ask tell understand remember recall decide explain see show learn consider discuss i""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
