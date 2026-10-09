import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Judging from the dark clouds in the west, … → 西の暗い雲から判断すると / Judging by his accent → 彼のなまりから判断すると（でから にしない）
rep("""        const mj = mark();
        const pj = parsePP(a + 1, b, {});
        if (pj && isP(T[pj.end], ',') && pj.end + 1 < b) { lead += pj.ja.replace(/(?:から|によって)$/, '') + 'から判断すると、'; a = pj.end + 1; continue; }
        fail(mj);""",
    """        const mj = mark();
        let cj = -1;
        for (let x = a + 3; x < b - 1; x++) if (isP(T[x], ',')) { cj = x; break; }
        let nj = cj > 0 ? np(a + 2, cj, {}) : null;
        if (nj && nj.end < cj) { const mj2 = mark(); const nj2 = np(a + 2, cj, { pp: true }); if (nj2 && nj2.end === cj) nj = nj2; else fail(mj2); }
        if (nj && nj.end === cj) { lead += nj.ja + 'から判断すると、'; a = cj + 1; continue; }   // Judging from the dark clouds in the west, …
        fail(mj);
        const pj = parsePP(a + 1, b, {});
        if (pj && isP(T[pj.end], ',') && pj.end + 1 < b) { lead += pj.ja.replace(/(?:から|によって|で)$/, '') + 'から判断すると、'; a = pj.end + 1; continue; }
        fail(mj);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
