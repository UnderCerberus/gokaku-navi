import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She has a kind and loving heart → 優しくて愛情のある心（気持ちの形容詞・文脈なら 心。病気・脈の文脈は 心臓）
rep("""    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
""",
    """    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
    if (nom.head === 'heart' && /心臓$/.test(ja) && !T.some((x) => x.k === 'w' && /^(?:attack|attacks|disease|diseases|surgery|beat|beats|beating|rate|pump|pumps|pumped|blood|doctor|doctors|patient|patients|transplant|failure|muscle|organ|organs|lungs|chest|stopped|healthy|exercise)$/.test(x.w)) && T.some((x) => x.k === 'w' && /^(?:kind|warm|loving|good|big|gentle|broken|open|pure|cold|heavy|generous|caring|feel|feels|felt|feeling|feelings|touched|moved|bottom|follow|love|loved|hope|courage)$/.test(x.w))) ja = ja.replace(/心臓$/, '心');   // a kind heart → 優しい心
""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
