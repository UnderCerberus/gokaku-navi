import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# my mother wrote down every step for me → 母は手順をすべて書き留めた（熟語 write down / go over / read through ~ の目的語の step も「手順」。p545f の熟語側）
rep("""        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:について|に対して|として|を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""",
    """        if (obj.ja && /^(?:step|steps)$/.test(obj.head || '') && /^(?:write|note|jot|set|spell|go|read|list|copy|lay|point|walk|talk)$/.test(vg.lemma || '') && /(?:一歩|工程)$/.test(obj.ja)) obj = Object.assign({}, obj, /^すべての(?:一歩|工程)$/.test(obj.ja) ? { ja: '手順をすべて', bare: true } : { ja: obj.ja.replace(/(?:一歩|工程)$/, '手順') });
        const ja = obj.ja ? (obj.bare ? jaT.replace(/〜を/, obj.ja) : jaT).replace('〜', obj.ja) : it.ja.replace(/〜(?:について|に対して|として|を|に|が|と|の)?/, '');   // 何でも（bare）は「を」を付けない""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
