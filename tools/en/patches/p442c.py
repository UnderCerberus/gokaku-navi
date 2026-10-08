import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""T[i + 1] && T[i + 1].k === 'w' && /^(?:i|you|he|she|we|they|it|my|your|his|her|our|their|the|everyone|nobody|someone|there)$/.test(T[i + 1].w) && i + 2 < lim && !o.afraidThat""",
    """T[i + 1] && T[i + 1].k === 'w' && (/^(?:i|you|he|she|we|they|it|my|your|his|her|our|their|the|everyone|nobody|someone|there|everything|things|something|nothing|people|this|these|those|everybody|anyone|anything|somebody|nobody|some|many|most|no|a|an|all)$/.test(T[i + 1].w) || (T[i + 1].cap && !!NAME_JA[T[i + 1].w])) && i + 2 < lim && !o.afraidThat""")

rep(""".replace(/^私は(.+?)だろうと確信している(。?)$/, 'きっと$1だろう$2')""",
    """.replace(/^私は(.+?)だろうと確信している(。?)$/, 'きっと$1だろう$2').replace(/物(が|は)(?=うまく)/g, '物事$1')""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
