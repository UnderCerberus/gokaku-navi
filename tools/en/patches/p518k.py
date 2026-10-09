import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …what is called a win-win situation, in which both sides benefit → 両方の側が利益を得る、いわゆる双方に利益のある状況
rep("""      if (nWc && (nWc.end === lim || isP(T[nWc.end], ','))) { name('relative-what'); return { ja: 'いわゆる' + nWc.ja, end: nWc.end, clause: true }; }   // what is called a win-win situation → いわゆる…""",
    """      if (nWc && isP(T[nWc.end], ',') && T[nWc.end + 1] && T[nWc.end + 1].k === 'w' && PREP[T[nWc.end + 1].w] && isW(T[nWc.end + 2], 'which') && nWc.end + 3 < lim) {
        const mWr = mark();
        const cWr = sentence(nWc.end + 3, lim, { sub: true });
        if (cWr) { name('relative-what'); name('relative'); return { ja: cWr.out({ part: 'が', form: 'attr' }) + '、いわゆる' + nWc.ja, end: lim, clause: true }; }   // , in which both sides benefit
        fail(mWr);
      }
      if (nWc && (nWc.end === lim || isP(T[nWc.end], ','))) { name('relative-what'); return { ja: 'いわゆる' + nWc.ja, end: nWc.end, clause: true }; }   // what is called a win-win situation → いわゆる…""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
