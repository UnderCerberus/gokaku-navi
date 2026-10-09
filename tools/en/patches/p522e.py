import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The music I listen to is good / The languages a child is exposed to are important（to のあとの is / was / 3 単現・過去形は不定詞ではない → 主節の動詞の始まり）
rep("""    if (pv && pv.k === 'w' && (pv.w === 'to' || (DET[pv.w] !== undefined && !PRON[pv.w] && !otherPron && !qtyEnd))) return false;""",
    """    const toFin = !!pv && pv.w === 'to' && (/^(?:is|are|was|were|am|has|had|does|did|can|could|will|would|shall|should|may|might|must)$/.test(t.w) || (!!vc(t, ['3sg', 'past']) && !vc(t, ['base'])));   // the music I listen to is good
    if (pv && pv.k === 'w' && ((pv.w === 'to' && !toFin) || (DET[pv.w] !== undefined && !PRON[pv.w] && !otherPron && !qtyEnd))) return false;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
