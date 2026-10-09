import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# better at controlling their emotions → 感情をコントロールする（感情・怒り・体重などの control は「支配する」ではない）
rep("""  const VOBJ = COLL([
    'produce|result results outcome outcomes|を|出す',""",
    """  const VOBJ = COLL([
    'control|emotion emotions feeling feelings anger temper stress weight appetite impulse impulses behavior behaviour breathing diet|を|コントロールする',
    'produce|result results outcome outcomes|を|出す',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
