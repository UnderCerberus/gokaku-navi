import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the power went out across the whole city → 市全体で停電した（across + 地域 = 〜じゅうで。横切って にしない）
rep("""        if (!obj.pron && obj.det === 'the' && /^(?:world|globe|planet)$/.test(obj.head || '')) return R('世界中で', 'other', '世界中の');
""",
    """        if (!obj.pron && obj.det === 'the' && /^(?:world|globe|planet)$/.test(obj.head || '')) return R('世界中で', 'other', '世界中の');
        if (!obj.pron && obj.head !== 'whole' && /全体$/.test(n)) return R(n + 'で', 'other', n + 'の');   // across the whole city → 市全体で
        if (!obj.pron && /^(?:city|town|region|continent|prefecture|province|state|island)$/.test(obj.head || '') && !/^(?:a|an|one)$/.test(obj.det || '') && !T.some((x) => x.k === 'w' && /^(?:way|walk|walks|walked|walking|run|runs|ran|running|swim|swims|swam|swimming|fly|flies|flew|flying|travel|travels|traveled|travelled|traveling|travelling|drive|drives|drove|driving|ride|rides|rode|sail|sails|sailed|crawl|crawled|cross|crossed|hurry|hurried|rush|rushed|stretch|stretches|stretched|flow|flows|flowed|bridge|bridges|road|roads|line|lines|tunnel|tunnels)$/.test(x.w))) return R(n + '全体で', 'other', n + '全体の');   // power outages across the city → 市全体で
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
