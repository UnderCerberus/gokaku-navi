import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Seeing, hearing, or reading about it can make you … → 見たり、聞いたり…（コンマのあとに -ing が続く動名詞の列挙は分詞構文にしない）
rep("""    let c0 = -1;
    for (let x = a + 1; x < b - 1; x++) { if (isP(T[x], ',')) { c0 = x; break; } }
    if (c0 > 0) {""",
    """    let c0 = -1;
    for (let x = a + 1; x < b - 1; x++) { if (isP(T[x], ',')) { c0 = x; break; } }
    if (c0 > 0 && c0 <= a + 2 && T[c0 - 1].k === 'w' && !!vc(T[c0 - 1], ['ing']) && T[c0 + 1] && T[c0 + 1].k === 'w' && !!vc(T[c0 + 1], ['ing']) && isP(T[c0 + 2], ',')) c0 = -1;   // Seeing, hearing, or reading …（動名詞の列挙）
    if (c0 > 0) {""")

# hearing（動名詞の列挙の hear）→ 聞く / make you do the same → 同じことをする
rep("""            const parts = bare.map((x) => { const cx = vc(T[x], ['ing']); pick(x, cx.e); return P(verbSense(cx.e, true).core).form('past') + 'り'; });""",
    """            const parts = bare.map((x) => { const cx = vc(T[x], ['ing']); pick(x, cx.e); const cr = verbSense(cx.e, true).core.replace(/^聞こえる$/, '聞く').replace(/^見える$/, '見る'); return P(cr).form('past') + 'り'; });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
