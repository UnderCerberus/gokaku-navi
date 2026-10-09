import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# She drove the car back to the garage（back / home / away は SVOC の補語にしない: 車を後ろのものにした にしない）
rep("""    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L))) {""",
    """    if (SVOCV[L] && !T.slice(i, j).some((x) => isW(x, 'with')) && !(tj && tj.k === 'w' && /^(?:later|soon|again|back|tonight|tomorrow|today|now|early|late|often|first)$/.test(tj.w) && /^(?:call|get|find|leave|make|turn)$/.test(L)) && !(tj && tj.k === 'w' && /^(?:back|home|away)$/.test(tj.w))) {""")

# took the bus back to the hotel（乗り物 + back は take back ~（取り消す）の熟語にしない → ホテルへ戻るバスに乗った）
rep("""        const a = objBefore(i, lim, (x, q) => q > i && seq(q, it.lit));""",
    """        const a = objBefore(i, lim, (x, q) => q > i && seq(q, it.lit));
        if (a && it.lit[0] === 'back' && /(?:^| )(?:bus|buses|train|trains|taxi|taxis|flight|flights|plane|planes|ferry|ferries|boat|boats|subway|ship|ships)$/.test(a.head || '') && /^(?:take|catch|get)$/.test(vg.lemma)) { fail(m); continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
