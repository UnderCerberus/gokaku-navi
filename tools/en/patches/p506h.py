import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# a private home / a beautiful home（限定詞つきの「形容詞 + home」は名詞）
rep("""(nx.w === 'home' && /^(?:only|own|new|old|sweet|second|real|first|true|permanent|temporary|childhood|family)$/.test(T[md.end - 1] ? T[md.end - 1].w : ''))""",
    """(nx.w === 'home' && (hasDet || /^(?:only|own|new|old|sweet|second|real|first|true|permanent|temporary|childhood|family)$/.test(T[md.end - 1] ? T[md.end - 1].w : '')))""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
