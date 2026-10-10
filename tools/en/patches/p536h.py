import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Contagious yawning / Loud yawning → 伝染性のあくび・大きいあくび（形容詞のあとの -ing の名詞: 「Xをする」の動詞は X だけ。「あくびを」にしない）
rep("""        ja += /する$/.test(icore) ? icore.replace(/する$/, '') : icore + 'こと';""",
    """        ja += /する$/.test(icore) ? icore.replace(/を?する$/, '') : icore + 'こと';""")

# empathy, the ability to share the feelings of others → 共感、つまり他人の感情を共有する能力（限定詞のない名詞 + , the + 名詞句（文末まで）も説明の同格）
rep("""        const descApp = !!app && app.end >= lim && !outerList && !node.time && !app.time && (!app.num || numApp) && desc(node) && !verbTail &&""",
    """        const descApp = !!app && app.end >= lim && !outerList && !node.time && !app.time && (!app.num || numApp) && (desc(node) || (!node.det && !node.pron && !node.proper && !node.pl && app.det === 'the' && !app.pron)) && !verbTail &&""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
