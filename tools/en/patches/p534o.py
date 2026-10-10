import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# could now reach ordinary people → 届くようになった（届く・起こる などの無意志の動詞は可能形にしない。「届ける」は別の動詞）
rep("""    const canP = (x) => (/(?:聞こえる|見える|分かる|手が届く)$/.test(x.s) ? x : x.aux('can'));""",
    """    const canP = (x) => (/(?:聞こえる|見える|分かる|届く|起こる|生じる)$/.test(x.s) ? x : x.aux('can'));""")

# Printing shops had appeared in … → 印刷所（辞書の複合名詞 printing shop を動名詞にしない）
rep("""  function ingVerb(j, lim) {
    const t = T[j];""",
    """  function ingVerb(j, lim) {
    const t = T[j];
    if (t && t.k === 'w' && j + 1 < lim && /ing$/.test(t.w) && (() => { const mwI = multiAt(j, lim); return !!mwI && mwI.len >= 2 && !!mwI.e && /^(?:printing|swimming|parking|shopping|cooking|washing|sleeping|living|dining|waiting|meeting|training|teaching|learning|reading|writing|walking|running|boarding|recycling|sewing|baking|cutting|recording|operating|fishing|hunting|camping|building|sporting)\\b/.test(mwI.e.w || ''); })()) return false;   // printing shops / swimming pool は複合名詞""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
