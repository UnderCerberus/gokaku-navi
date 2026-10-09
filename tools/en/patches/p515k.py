import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# , with NP V-ing: 不定の名詞（a dog / more people）は が、主節が進行形（増えている）なら後ろの文も ている
rep("""            const wJa = nWi.ja + 'は' + vWi.parts.join('') + vWi.pred.end({ neg: !!vWi.neg, past: /た。?$/.test(rWi.ja) });""",
    """            const pWi = /ている。?$/.test(rWi.ja) && !/ている$/.test(vWi.pred.s) ? vWi.pred.aux('prog') : vWi.pred;
            const wJa = nWi.ja + (/^(?:a|an|more|many|some|several|most)$/.test(T[kWi + 2].w || '') ? 'が' : 'は') + vWi.parts.join('') + pWi.end({ neg: !!vWi.neg, past: /た。?$/.test(rWi.ja) });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
