import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The answer is neither to ban phones completely nor to allow them without limits → 電話を完全に禁止することでも、制限なしに許すことでもない（be + neither to V nor to V）
rep("""    // be left（残っている）: how much of the book is left / Only two days are left""",
    """    if (isW(T[i], 'neither') && isW(T[i + 1], 'to') && i + 4 < lim && !vg.neg) {
      const kNr = T.findIndex((x, q) => q > i + 2 && q < lim - 2 && isW(x, 'nor') && isW(T[q + 1], 'to'));
      if (kNr > 0) {
        const mNr = mark();
        const v1Nr = vpNonfin(i + 2, kNr, 'base', { subj: sj });
        const v2Nr = v1Nr && v1Nr.end === kNr ? vpNonfin(kNr + 2, lim, 'base', { subj: sj }) : null;
        if (v2Nr && v2Nr.end === lim) { name('correlative'); return fin(P(vpJoin(v1Nr, 'dict') + 'ことでも、' + vpJoin(v2Nr, 'dict') + 'ことでもない', 'i'), lim, 'SVC'); }
        fail(mNr);
      }
    }
    // be left（残っている）: how much of the book is left / Only two days are left""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
