import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# someone I miss → 私が会いたいと思う誰か（先行詞が代名詞 someone のときも、関係詞の穴に先行詞の語を持たせて p546i の語義選びに使う。a conversation with someone I miss のように直前が someone なら someone を先行詞の語にする）
rep("""ante: node.head }""", """ante: (typeof node.end === 'number' && T[node.end - 1] && /^(?:someone|somebody)$/.test(T[node.end - 1].w || '') ? T[node.end - 1].w : node.head || node.pron) }""", 8)

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
