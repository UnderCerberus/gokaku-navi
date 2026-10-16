import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# had helped each other for three generations → 3世代にわたって（for + 数 + generations は期間。「3つの世代のために」にしない）
rep("""    const R = (ja, kind, adn) => ({ ja: ja, kind: kind || 'other', adn: adn || adnOf(ja) });""",
    """    const R = (ja, kind, adn) => ({ ja: ja, kind: kind || 'other', adn: adn || adnOf(ja) });
    const mGn = key === 'for' && obj.num && /^generations?$/.test(obj.head || '') ? /^([0-9０-９]+|数)(?:つの)?世代$/.exec(n) : null;
    if (mGn) return R(mGn[1] + '世代にわたって', 'dur', mGn[1] + '世代にわたる');""")

# The two families → 2つの家族（家族を数える助数詞は「人」ではない）/ The fisherman's family and hers → 漁師の家族と彼女の家族
rep("""eye: 'つ', ear: 'つ',""", """eye: 'つ', family: 'つ', ear: 'つ',""")
rep("""    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、' + thenJa + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');""",
    """    const hdPs = first.end > i && T[first.end - 1].k === 'w' ? nounC(T[first.end - 1]) : null;
    if (hdPs && hdPs.e && (T.slice(i, first.end).some((x) => x.k === 'pos') || /^(?:my|your|his|her|our|their)$/.test(T[i].w || ''))) items.forEach((x, q) => { if (q > 0 && /^(?:私|あなた|彼|彼女|私たち|彼ら)のもの$/.test(x.ja || '')) items[q] = Object.assign({}, x, { ja: x.ja.replace(/もの$/, en.jp.first(hdPs.e.ja)) }); });
    const ja = then ? items.slice(0, -1).map((x) => x.ja).join('と') + '、' + thenJa + last.ja : items.map((x) => x.ja).join(conj === 'or' ? 'か' : 'と');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
