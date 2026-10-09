import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# they recorded how many hours they spent → 何時間費やしたか記録した（疑問詞節の主語の重複を省く: many などの代名詞は主語の候補にしない）
rep("""        const subjTokW = T.slice(iw + 1, wc.end).find((x) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub);""",
    """        const subjTokW = T.slice(iw + 1, wc.end).find((x) => x.k === 'w' && PRON[x.w] && PRON[x.w].sub && /^(?:i|you|he|she|we|they|it)$/.test(x.w));   // how many hours they spent の many は飛ばす""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
