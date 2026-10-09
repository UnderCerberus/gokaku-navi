import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# A short nap in the afternoon can improve memory → 午後の短い昼寝（活動の名詞 + 時の句 + 動詞なら、時の句を名詞につける）
rep("""after school|before school|after work|after lunch|after dinner|after breakfast)$/.test(T.slice(j, pp.end).map((x) => x.w).join(' '))) { fail(m1); break; }   // a baker in the future → 将来（名詞につけない）""",
    """after school|before school|after work|after lunch|after dinner|after breakfast)$/.test(T.slice(j, pp.end).map((x) => x.w).join(' ')) && !(node.head && /^(?:nap|naps|walk|walks|class|classes|meeting|meetings|lesson|lessons|sleep|break|breaks|snack|snacks|shift|shifts|exercise|traffic|temperature|temperatures|session|sessions|rush|meal|meals)$/.test(node.head) && T[pp.end] && T[pp.end].k === 'w' && (!!MODAL[T[pp.end].w] || !!BE[T[pp.end].w] || !!vc(T[pp.end], ['3sg', 'past'])))) { fail(m1); break; }   // a baker in the future → 将来（名詞につけない）""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
