import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# not は前で読み飛ばされて to から来ることがある
rep("""    if (seq(j, ['not', 'to']) && vg && j + 3 < lim && T[j + 2].k === 'w' && !!vc(T[j + 2], ['base'])) {
      const mNtb = mark();
      const kBtb = T.findIndex((x, q) => q > j + 2 && q < lim - 2 && isW(x, 'but') && isW(T[q + 1], 'to'));
      if (kBtb > 0) {
        const eAtb = isP(T[kBtb - 1], ',') ? kBtb - 1 : kBtb;
        const v1tb = vpNonfin(j + 2, eAtb, 'base', {}),""",
    """    const kTtb = isW(t, 'not') ? j + 1 : j;
    if (isW(T[kTtb], 'to') && kTtb > 0 && isW(T[kTtb - 1], 'not') && vg && kTtb + 2 < lim && T[kTtb + 1].k === 'w' && !!vc(T[kTtb + 1], ['base'])) {
      const mNtb = mark();
      const kBtb = T.findIndex((x, q) => q > kTtb + 1 && q < lim - 2 && isW(x, 'but') && isW(T[q + 1], 'to'));
      if (kBtb > 0) {
        const eAtb = isP(T[kBtb - 1], ',') ? kBtb - 1 : kBtb;
        const v1tb = vpNonfin(kTtb + 1, eAtb, 'base', {}),""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
