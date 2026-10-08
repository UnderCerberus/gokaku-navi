import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    if (key === 'over' && (obj.dur || (obj.num && obj.head && DURUNIT[obj.head])) && /(?:間|年|か月|世紀|日|週間)$/.test(n)""",
    """    if (key === 'over' && (obj.dur || (obj.num && obj.head && DURUNIT[obj.head.replace(/ies$/, 'y').replace(/s$/, '')])) && /(?:間|年|か月|世紀|日|週間)$/.test(n)""")
rep("""|run|runs|ran|continue|continues|continued|walk|walked|walks|drive|drove|drives|swim|swam|swims)$/.test(x.w || ''))) return R(n + 'にわたって', 'dur', n + 'にわたる');""",
    """|run|runs|ran|continue|continues|continued)$/.test(x.w || ''))) return R(n + 'にわたって', 'dur', n + 'にわたる');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
