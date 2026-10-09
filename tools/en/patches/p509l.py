import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Curiosity, rather than intelligence, is … → 知能というよりむしろ好奇心が（コンマで挟んだ rather than B）
rep("""    if (!o.noThan && !first.clause && !vpRt && isW(T[first.end], 'rather') && isW(T[first.end + 1], 'than') && first.end + 2 < lim) {""",
    """    if (!o.noThan && !first.clause && isP(T[first.end], ',') && isW(T[first.end + 1], 'rather') && isW(T[first.end + 2], 'than') && first.end + 4 < lim) {
      const mrc = mark();
      const b4 = np(first.end + 3, lim, Object.assign({}, o, { noCoord: true, noRel: true }));
      if (b4 && isP(T[b4.end], ',') && b4.end + 1 <= lim) { name('comparative'); return Object.assign({}, first, { ja: b4.ja + 'というよりむしろ' + first.ja, end: b4.end + 1 }); }
      fail(mrc);
    }
    if (!o.noThan && !first.clause && !vpRt && isW(T[first.end], 'rather') && isW(T[first.end + 1], 'than') && first.end + 2 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
