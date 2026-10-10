import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# get thirty people together / put all the clips together（動詞 + 目的語 + together の熟語も「動詞 + 目的語 + 副詞」の枠で引く）
rep("""/^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round)$/.test(low[2])) {""",
    """/^(?:up|out|off|away|back|down|over|on|in|apart|free|around|round|together)$/.test(low[2])) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
