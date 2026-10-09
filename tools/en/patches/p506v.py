import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# While some experts welcome …, others worry that … → 〜を歓迎する専門家もいれば、〜を心配する専門家もいる（文頭の while / whereas + some 名詞）
rep("""    if (isW(T[0], 'some') && T[1] && T[1].k === 'w' && !vc(T[1], ['base']) && !!nounC(T[1]) && !tokens.__someN) {
      const kOw = T.findIndex((x, q) => q > 3 && isW(x, 'others') && (isP(T[q - 1], ',') || (T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ','))));
      if (kOw > 0 && kOw + 1 < b) {
        const kEw = isP(T[kOw - 1], ',') ? kOw - 1 : kOw - 2;
        const hdW = T[1].s || T[1].w;
        const t1W = tokens.slice(0, kEw).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));""",
    """    const sW0 = T[0] && T[0].k === 'w' && /^(?:while|whereas|although|though)$/.test(T[0].w) && isW(T[1], 'some') ? 1 : 0;
    if (isW(T[sW0], 'some') && T[sW0 + 1] && T[sW0 + 1].k === 'w' && !vc(T[sW0 + 1], ['base']) && !!nounC(T[sW0 + 1]) && !tokens.__someN) {
      const kOw = T.findIndex((x, q) => q > 3 + sW0 && isW(x, 'others') && (isP(T[q - 1], ',') || (!sW0 && T[q - 1] && /^(?:while|whereas|but|and)$/.test(T[q - 1].w || '') && isP(T[q - 2], ','))));
      if (kOw > 0 && kOw + 1 < b) {
        const kEw = isP(T[kOw - 1], ',') ? kOw - 1 : kOw - 2;
        const hdW = T[sW0 + 1].s || T[sW0 + 1].w;
        const t1W = tokens.slice(sW0, kEw).concat([{ k: 'p', w: '.', s: '.' }]).map((x, k) => Object.assign({}, x, { i: k }));""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
