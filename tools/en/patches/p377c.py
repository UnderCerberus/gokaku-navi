import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""&& !(i > 1 && T[i - 1] && T[i - 1].w === 'the' && T[i - 2] && /^(?:wash|washes|washed|washing|do|does|did|doing|dry|dries|dried|clear|cleared|put)$/.test(T[i - 2].w || '')) &&""",
    """&& !T.some((x, q) => /^(?:wash|washes|washed|washing|dry|dries|dried|clear|cleared)$/.test(x.w || '') && T.slice(q + 1, q + 4).some((y) => /^(?:dish|dishes)$/.test(y.w || ''))) &&""")

rep("""    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');""",
    """    ja = ja.replace(/^(春|夏|秋|冬)に、/, '$1には、');
    if (tokens.some((x, q) => x.w === 'wait' && tokens[q + 1] && tokens[q + 1].w === 'and' && tokens[q + 2] && tokens[q + 2].w === 'see')) ja = ja.replace(/待ち、見/, '様子を見').replace(/待って、見/, '様子を見');   // We had to wait and see → 様子を見なければならなかった
    if (/^あなたは/.test(ja)) ja = ja.replace(/(、)あなたの(?=[^、。]{1,6}を)/g, '$1').replace(/^(あなたは[^、。]{0,12}?)あなたの(?=[^、。]{1,6}を)/, '$1');   // You must wash your hands and brush your teeth → 歯をみがかなければならない""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
