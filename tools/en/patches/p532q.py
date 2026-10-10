import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# One Sunday, she asked me … → ある日曜日、（one + 曜日・週末）
rep("""'one afternoon': 'ある午後'""",
    """'one afternoon': 'ある午後', 'one sunday': 'ある日曜日', 'one monday': 'ある月曜日', 'one tuesday': 'ある火曜日', 'one wednesday': 'ある水曜日', 'one thursday': 'ある木曜日', 'one friday': 'ある金曜日', 'one saturday': 'ある土曜日', 'one weekend': 'ある週末'""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
