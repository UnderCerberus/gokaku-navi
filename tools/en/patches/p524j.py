import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The noise drove me crazy → 私をひどくいらいらさせた（drive + O + crazy / mad は「気が狂っているようにした」にしない）
rep("""      const ap2 = adjAt(j, lim);
      if (ap2) {
        const f2 = ap2.lemma === 'social'""",
    """      const ap2 = adjAt(j, lim);
      if (ap2 && L === 'drive' && /^(?:crazy|mad|nuts|insane)$/.test(ap2.lemma || '') && (ob.an || (ob.pron && PRON[ob.pron] && PRON[ob.pron].an))) { pick(ap2.idx, ap2.e); name('svoc'); return done(vg, P('ひどくいらいらさせる', 'v1'), st, ap2.end < lim ? tail(ap2.end, lim, st, o, vg) : ap2.end, 'SVOC', o, [objStr(ob, 'を', st)], { noStative: true }); }
      if (ap2) {
        const f2 = ap2.lemma === 'social'""")

# Please take these books back to the library → 図書館にこれらの本を返して（物 + back to + 場所 は「返す」。言葉・約束などは「取り消す」）
rep("""        const jaSp = it.it && /^pick (?:up ~|~ up)$/.test(it.it.phrase)""",
    """        const jaSp = it.it && it.it.phrase === 'take back ~' && ((ppNext && isW(T[a.end + 1], 'to')) || (!a.pron && !/(?:^| )(?:word|words|statement|statements|remark|remarks|comment|comments|promise|promises|offer|claim|claims|apology)$/.test(a.head || ''))) ? '〜を返す' : it.it && /^pick (?:up ~|~ up)$/.test(it.it.phrase)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
