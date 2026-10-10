import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# in a single day / a single year → たった1日で・たった1年で（a single + 期間の単位は期間。「ただ1つの日に」にしない）
rep("""    const single0 = !!nom.preJa && !num && detW === 'a' && nom.end - 2 === i + 1 && isW(T[nom.end - 2], 'single');""",
    """    if (detW === 'a' && !num && nom.end === i + 3 && isW(T[i + 1], 'single') && nom.c && DURUNIT[nom.c.lemma] && UNIT[nom.c.lemma]) return postMod({ ja: 'たった1' + UNIT[nom.c.lemma], end: nom.end, head: nom.c.lemma, dur: true, num: { val: 1, ja: '1' }, unit: nom.c.lemma }, lim, o);   // in a single day → たった1日で
    const single0 = !!nom.preJa && !num && detW === 'a' && nom.end - 2 === i + 1 && isW(T[nom.end - 2], 'single');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
