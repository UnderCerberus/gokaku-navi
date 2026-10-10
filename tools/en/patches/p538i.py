import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# I was surprised at how delicious it tasted → それがどれほどおいしかったかに驚いた / how good it smelled → どれほど良いにおいがしたか（形容詞の空所 + taste / smell）
rep("""    if (o.gap && o.gap.type === 'adj' && !o.gap.used && o.gap.isPred && /^(?:become|get|grow|turn|seem|appear|look|feel|sound|remain|stay|prove)$/.test(vg.lemma) && !vg.passive""",
    """    if (o.gap && o.gap.type === 'adj' && !o.gap.used && o.gap.isPred && /^(?:become|get|grow|turn|seem|appear|look|feel|sound|remain|stay|prove|taste|smell)$/.test(vg.lemma) && !vg.passive""")
rep("""        const pG = /^(?:become|get|grow|turn)$/.test(vg.lemma) ? P(naru, /出る$/.test(naru) ? 'v1' : 'v5') : (/^(?:seem|appear|look|sound)$/.test(vg.lemma)""",
    """        const gjT = vg.lemma === 'taste' ? gj.replace(/(?:良い|よい|いい|すばらしい|素晴らしい)$/, 'おいしい') : gj;
        const pG = vg.lemma === 'taste' ? (/(?:おいしい|まずい)$/.test(gjT) ? P(gjT, 'i') : P(gjT.replace(/だ$/, 'な') + '味がする', 'suru')) : vg.lemma === 'smell' ? P(gj.replace(/だ$/, 'な') + 'においがする', 'suru') : /^(?:become|get|grow|turn)$/.test(vg.lemma) ? P(naru, /出る$/.test(naru) ? 'v1' : 'v5') : (/^(?:seem|appear|look|sound)$/.test(vg.lemma)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
