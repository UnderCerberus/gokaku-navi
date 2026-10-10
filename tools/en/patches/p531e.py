import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# All through the interview, I kept worrying … / It rained all through the night → 面接の間ずっと・夜の間ずっと（all + through の句。all を目的語の「すべて」にしない）
rep("""    const m = mark();
    if (t.w === 'halfway' && T[i + 1]""",
    """    const m = mark();
    if (t.w === 'all' && isW(T[i + 1], 'through') && i + 2 < lim) {
      const pAt = parsePP(i + 1, lim, o);
      if (pAt && pAt.obj) return Object.assign({}, pAt, { ja: /の間ずっと$/.test(pAt.ja) ? pAt.ja : pAt.obj.ja + 'の間ずっと', adn: pAt.obj.ja + 'の間ずっとの', kind: 'time', prep: 'all through' });
      fail(m);
    }
    if (t.w === 'halfway' && T[i + 1]""")
rep("""    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w] || (t.w === 'halfway' &&""",
    """    if ((PREP[t.w] || mprepAt(j) || idiomIndex().prep[t.w] || (t.w === 'all' && isW(T[j + 1], 'through')) || (t.w === 'halfway' &&""")
rep("""      if (seq(j0, ['as', 'many', 'times', 'as'])) { const kAm = modOther(j0, lim, st, o, vg); if (kAm > 0) { j = kAm; continue; } }""",
    """      if (seq(j0, ['as', 'many', 'times', 'as']) || (isW(t, 'all') && isW(T[j0 + 1], 'through'))) { const kAm = modOther(j0, lim, st, o, vg); if (kAm > 0) { j = kAm; continue; } }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
