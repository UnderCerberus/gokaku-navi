import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# parseVG は will not only save の only を副詞（vg.advs）に入れ、i は動詞の後ろ（money）になる → 動詞の位置 vg.idx から読み直す
rep("""    const kOnly = vg.neg && vg.modal ? (T[i] && T[i].k === 'w' && /^(?:only|just|merely|simply)$/.test(T[i].w) ? i : (i > 1 && T[i - 1].k === 'w' && /^(?:only|just|merely|simply)$/.test(T[i - 1].w) && isW(T[i - 2], 'not') ? i - 1 : -1)) : -1;
    if (kOnly >= 0 && !o.noNotOnly) {
      let kB = -1;
      for (let x = kOnly + 2; x < lim - 1; x++) if (isW(T[x], 'but') && (isW(T[x + 1], 'also') || (T[x + 1].k === 'w' && !!vc(T[x + 1], ['base']) && !BE[T[x + 1].w]))) { kB = x; break; }
      const kV2 = kB > 0 ? (isW(T[kB + 1], 'also') ? kB + 2 : kB + 1) : -1;
      const eA = kB > 0 && isP(T[kB - 1], ',') ? kB - 1 : kB;
      if (kB > 0 && T[kOnly + 1].k === 'w' && !!vc(T[kOnly + 1], ['base']) && kV2 < lim && T[kV2].k === 'w' && !!vc(T[kV2], ['base'])) {
        const mNo = mark();
        const v1 = vpNonfin(kOnly + 1, eA, 'base', { subj: o.subj });""",
    """    const kV1 = vg.neg && vg.modal && vg.idx >= 0 && vg.idx < i && vg.advs.some((x) => /^(?:only|just|merely|simply)$/.test(x.w || '')) && T.slice(Math.max(0, vg.idx - 3), vg.idx).some((x) => isW(x, 'not')) ? vg.idx : -1;
    if (kV1 >= 0 && !o.noNotOnly) {
      let kB = -1;
      for (let x = i; x < lim - 1; x++) if (isW(T[x], 'but') && (isW(T[x + 1], 'also') || (T[x + 1].k === 'w' && !!vc(T[x + 1], ['base']) && !BE[T[x + 1].w]))) { kB = x; break; }
      const kV2 = kB > 0 ? (isW(T[kB + 1], 'also') ? kB + 2 : kB + 1) : -1;
      const eA = kB > 0 && isP(T[kB - 1], ',') ? kB - 1 : kB;
      if (kB > 0 && kV2 < lim && T[kV2].k === 'w' && !!vc(T[kV2], ['base'])) {
        const mNo = mark();
        const v1 = vpNonfin(kV1, eA, 'base', { subj: o.subj });""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
