import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# So beautiful was the view from the mountain that we stayed there → 山からの眺めはとても美しかったので（倒置の主語に前置詞句がついてもよい）
rep("""        const sjSo = np(a + 3, th, { noRel: true });
        if (sjSo && sjSo.end === th) {""",
    """        let sjSo = np(a + 3, th, { noRel: true });
        if (sjSo && sjSo.end < th) { const mSo2 = mark(); const sjSo2 = np(a + 3, th, { noRel: true, pp: true }); if (sjSo2 && sjSo2.end === th) sjSo = sjSo2; else fail(mSo2); }   // the view from the mountain
        if (sjSo && sjSo.end === th) {""")
# until the sun went down → 日が沈むまで（太陽が下がる にしない）
rep("""    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
""",
    """    if (nom.head === 'cause' && /原因$/.test(ja) && nom.end < lim && isW(T[nom.end], 'for')) ja = ja.replace(/原因$/, '理由');
""")

# the sun went down → 太陽が沈んだ（太陽・月の go down は 沈む。下がる にしない）
rep("""    if (vg.lemma === 'stay' && /^滞在する$/.test(p.plain())""",
    """    if (/^(?:go|come)$/.test(vg.lemma) && /^(?:下がる|降りる|下りる)$/.test(p.plain()) && sj && /^(?:sun|moon)$/.test(sj.head || '')) p = P('沈む', 'v5');   // the sun went down → 沈んだ
    if (vg.lemma === 'stay' && /^滞在する$/.test(p.plain())""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
