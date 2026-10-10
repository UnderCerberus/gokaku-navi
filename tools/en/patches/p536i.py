import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Empathy, the ability to share the feelings of others, is important → 共感、つまり他人の感情を共有する能力は重要だ（文中の同格: 限定詞のない名詞 + , the + 名詞句 + , + 動詞）
rep("""        const midApp = !!app && app.end < lim && isP(T[app.end], ',') && !outerList && !node.time && desc(node) && !!app.rel && /^(?:someone|something|one|those)$/.test(app.pron || '');""",
    """        const midApp = !!app && app.end < lim && isP(T[app.end], ',') && !outerList && !node.time && ((desc(node) && !!app.rel && /^(?:someone|something|one|those)$/.test(app.pron || '')) ||
          (!node.pron && !node.proper && app.det === 'the' && !app.pron && app.end + 1 <= lim && !!T[app.end + 1] && T[app.end + 1].k === 'w' && (!!BE[T[app.end + 1].w] || !!MODAL[T[app.end + 1].w] || (!!vc(T[app.end + 1], ['3sg', 'past']) && (!nounC(T[app.end + 1]) || (!!T[app.end + 2] && T[app.end + 2].k === 'w' && (!!PREP[T[app.end + 2].w] || !!ADV[T[app.end + 2].w] || DET[T[app.end + 2].w] !== undefined)))))));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
