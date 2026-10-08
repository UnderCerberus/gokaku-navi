import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""    ja = ja.replace(/自分の誇りに思/g, '自分を誇りに思');""",
    """    ja = ja.replace(/自分の((?:とても|非常に|すごく)?)誇りに思/g, '自分を$1誇りに思').replace(/アルバイトを得/g, 'アルバイトをし');   // he felt very proud of himself → 自分をとても誇りに思った / get a part-time job → アルバイトをする
    if (tokens.some((x) => /^(?:save|saves|saved|saving)$/.test(x.w || '')) && tokens.some((x) => x.w === 'money') && tokens.some((x, q) => /^(?:enough|up)$/.test(x.w || '') || (x.w === 'for' && q > 0) || (x.w === 'to' && tokens[q + 1] && /^(?:buy|go|travel|pay|get)$/.test(tokens[q + 1].w || '')))) ja = ja.replace(/お金を節約(し|す)/g, 'お金を貯め').replace(/貯めた/g, '貯めた');   // he had saved enough money → 十分なお金を貯めていた""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
