import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# V (+ 目的語・前置詞句) not only to A but also to B → Aするためだけでなく、Bするためにも V（parseVP の入口で、not only to の位置を探して前後を分けて読む）
rep("""    if (isW(T[i], 'not') && !vg.neg && !o.noNotBut && T[i + 1] && T[i + 1].k === 'w' && PREP[T[i + 1].w] && i + 4 < lim) {""",
    """    if (!o.noNotOnlyTo && !vg.neg) {
      const kNo = T.findIndex((x, q) => q >= i && q < lim - 4 && isW(x, 'not') && isW(T[q + 1], 'only') && isW(T[q + 2], 'to') && T[q + 3] && T[q + 3].k === 'w' && !!vc(T[q + 3], ['base']));
      const kBo = kNo >= 0 ? T.findIndex((x, q) => q > kNo + 4 && q < lim - 2 && isW(x, 'but') && (seq(q + 1, ['also', 'to']) || isW(T[q + 1], 'to'))) : -1;
      if (kNo >= 0 && kBo > 0) {
        const mNo2 = mark();
        const eAo = isP(T[kBo - 1], ',') ? kBo - 1 : kBo;
        const k2o = isW(T[kBo + 1], 'also') ? kBo + 3 : kBo + 2;
        const v1o = vpNonfin(kNo + 3, eAo, 'base', {}), v2o = v1o && v1o.end === eAo ? vpNonfin(k2o, lim, 'base', {}) : null;
        const rMo = v2o && v2o.end === lim ? (kNo === i ? done(vg, P(verbSense(vg.e, false).core), newSt(vg), kNo, 'SV', o, [], {}) : withTokens(T, () => parseVP(vg, i, kNo, Object.assign({}, o, { noNotOnlyTo: true })))) : null;
        if (rMo && rMo.end === kNo && rMo.parts) {
          name('not-only');
          rMo.parts = [vpJoin(v1o, 'dict') + 'ためだけでなく、' + vpJoin(v2o, 'dict') + 'ためにも'].concat(rMo.parts);
          rMo.end = lim;
          return rMo;
        }
        fail(mNo2);
      }
    }
    if (isW(T[i], 'not') && !vg.neg && !o.noNotBut && T[i + 1] && T[i + 1].k === 'w' && PREP[T[i + 1].w] && i + 4 < lim) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
