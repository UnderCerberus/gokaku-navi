import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# when a machine takes over a task は 引き継ぐ のまま（a / an は時間の単位が続くときだけ）
rep(""".replace(/\\b(take|takes|took|taken|taking) over (?=(?:\\d|a |an |one |two |three |four |five |six |seven |eight |nine |ten |twenty |thirty |forty |fifty |a hundred |hundreds ))/gi, '$1 more than ')""",
    """.replace(/\\b(take|takes|took|taken|taking) over (?=(?:\\d|(?:a|an) (?:hour|day|week|month|year|minute|decade|century|hundred|thousand)\\b|one |two |three |four |five |six |seven |eight |nine |ten |twenty |thirty |forty |fifty |hundreds ))/gi, '$1 more than ')""")

# We walked for five kilometers → 5キロメートル歩いた
rep("""|run|runs|ran|continue|continues|continued)$/.test(x.w || ''))) return R(n + 'にわたって', 'dur', n + 'にわたる');""",
    """|run|runs|ran|continue|continues|continued)$/.test(x.w || ''))) return R(n + 'にわたって', 'dur', n + 'にわたる');
    if (key === 'for' && obj.num && obj.head && /^(?:kilometers|kilometres|miles|meters|metres|km|kilometer|mile|meter)$/.test(obj.head) && T.some((x) => /^(?:walk|walked|walks|walking|drive|drove|drives|driving|swim|swam|swims|swimming|ride|rode|rides|riding|jog|jogged|jogs|travel|traveled|travelled|travels|fly|flew|flies|hike|hiked|hikes|cycle|cycled)$/.test(x.w || ''))) return R(n, 'dur', n + 'の');   // We walked for five kilometers → 5キロメートル歩いた""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
