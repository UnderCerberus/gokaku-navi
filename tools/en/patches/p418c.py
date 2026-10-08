import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""        if (L === 'let' && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron)) && /^(?:you|us)$/.test(ob.pron || '') && !v3.neg && verbal(v3.pred)) return done(vg, P(vpJoin(v3, 'dict') + 'ことを可能にする', 'suru'),""",
    """        if (L === 'let' && o.subj && !o.subj.an && !(o.subj.pron && /^(?:i|you|he|she|we|they)$/.test(o.subj.pron)) && (/^(?:you|us)$/.test(ob.pron || '') || (!ob.pron && /^(?:user|users|people|visitors|visitor|customers|customer|students|student|players|player|readers|reader|drivers|driver|passengers|passenger|shoppers|members|viewers|listeners|fans|children|kids|patients|tourists|farmers|workers|scientists|researchers|doctors|teachers|parents)$/.test(ob.head || ''))) && !v3.neg && verbal(v3.pred)) return done(vg, P((ob.pron ? '' : ob.ja + 'が') + vpJoin(v3, 'dict') + 'ことを可能にする', 'suru'),""")

rep("""    ja = ja.replace(/(食べる|飲む)のに安全/g, (m0, a0) => (a0 === '食べる' ? '食べても' : '飲んでも') + '安全')""",
    """    ja = ja.replace(/(食べる|飲む|泳ぐ|使う|触る|遊ぶ|住む|歩く|渡る|登る)のに安全/g, (m0, a0) => ({ '食べる': '食べても', '飲む': '飲んでも', '泳ぐ': '泳いでも', '使う': '使っても', '触る': '触っても', '遊ぶ': '遊んでも', '住む': '住んでも', '歩く': '歩いても', '渡る': '渡っても', '登る': '登っても' })[a0] + '安全').replace(/^([^、。]{1,6})のトン(?=は|が|を|も)/, '大量の$1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
