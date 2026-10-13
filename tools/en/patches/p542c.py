import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# as people use more air conditioning to stay cool, the demand for electricity rises → より多くの冷房を使うにつれて、電気の需要は増える
# （as 節に more / less があり主節が増える・減る・上がる などの変化なら「〜につれて」。「使うので」にしない）
rep("""|| (sc.pred && /(?:より|もっと|ますます).*(?:になる|くなる|ようになる)$/.test((sc.parts || []).join('') + sc.pred.s))) return S('attr', false) + 'につれて、';""",
    """|| (sc.pred && /(?:より|もっと|ますます).*(?:になる|くなる|ようになる)$/.test((sc.parts || []).join('') + sc.pred.s)) || (((mn && mn.pred && /^(?:増える|減る|上がる|下がる|高まる|強まる|弱まる|広がる|増加する|減少する|上昇する|低下する|悪化する|改善する|成長する|変わる)$/.test(mn.pred.s || '')) || (typeof sc.end === 'number' && T.slice(sc.end, sc.end + 9).some((x) => /^(?:rise|rises|rose|increase|increases|increased|grow|grows|grew|fall|falls|fell|drop|drops|dropped|decline|declines|declined)$/.test(x.w || '')))) && /(?:より多く|より少な|もっと|ますます)/.test((sc.parts || []).join('')))) return S('attr', false) + 'につれて、';""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
