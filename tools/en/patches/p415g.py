import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

rep("""honey: 'ねえ', sweetie: 'ねえ', dear: 'ねえ', buddy: 'ねえ',""",
    """honey: 'ねえ', sweetie: 'ねえ', buddy: 'ねえ',""")

rep("""        if (b1 - a1 > 3) return null;
""",
    """        if (b1 - a1 > 3 || /^(?:dear|oops|hmm|hey|yeah|wow|oh|ah|well|hi|hello|okay|ok|so|um|uh|yes|no|sure|please|thanks|sorry|yep|nope|alas|ouch|oh|aha|whoa|gee|great|good|right|now|then|look|listen|anyway|actually|today|yesterday|tomorrow)$/.test(T[a1].w || '')) return null;
""")

rep("""        if (/(?:東京|大阪|京都|日本|名古屋""",
    """        if (/[A-Za-z]/.test(nV.ja)) return null;   // 訳のない語（Oops / Hmm）は名前ではない
        if (/(?:東京|大阪|京都|日本|名古屋""")

rep("""        const isName = vJ2 && !VOC_JA[T[cT + 1].w];
        if (vJ2 && (!isName || imper || intj || q || leftW.includes('you'))) {""",
    """        const isName = vJ2 && !VOC_JA[T[cT + 1].w];
        if (vJ2 && !/^(?:hi|hello|hey|bye|goodbye|good|see|thank|thanks|happy|merry|welcome|congratulations|nice)$/.test(leftW[0] || '') && (!isName || imper || intj || q || leftW.includes('you'))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
