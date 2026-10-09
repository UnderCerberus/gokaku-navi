import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# would not only improve A but also provide B → Aを改善するだけでなく、Bを提供するだろう
# （助動詞の否定のあとの not only … but (also) + 動詞: 否定ではなく動詞句の並列。埋め込みの節でも使えるよう動詞句の段で読む）
rep("""    const advs0 = vg.advs.slice();
    const gapUsed0 = o.gap ? o.gap.used : false;
    let best = null;
    const fns = [vpBeIdiom, vpIdiom, vpPassiveInf, vpPassiveList, vpFrame, vpGeneric];""",
    """    const kOnly = vg.neg && vg.modal ? (T[i] && T[i].k === 'w' && /^(?:only|just|merely|simply)$/.test(T[i].w) ? i : (i > 1 && T[i - 1].k === 'w' && /^(?:only|just|merely|simply)$/.test(T[i - 1].w) && isW(T[i - 2], 'not') ? i - 1 : -1)) : -1;
    if (kOnly >= 0 && !o.noNotOnly) {
      let kB = -1;
      for (let x = kOnly + 2; x < lim - 1; x++) if (isW(T[x], 'but') && (isW(T[x + 1], 'also') || (T[x + 1].k === 'w' && !!vc(T[x + 1], ['base']) && !BE[T[x + 1].w]))) { kB = x; break; }
      const kV2 = kB > 0 ? (isW(T[kB + 1], 'also') ? kB + 2 : kB + 1) : -1;
      const eA = kB > 0 && isP(T[kB - 1], ',') ? kB - 1 : kB;
      if (kB > 0 && T[kOnly + 1].k === 'w' && !!vc(T[kOnly + 1], ['base']) && kV2 < lim && T[kV2].k === 'w' && !!vc(T[kV2], ['base'])) {
        const mNo = mark();
        const v1 = vpNonfin(kOnly + 1, eA, 'base', { subj: o.subj });
        const v2 = v1 && v1.end === eA ? vpNonfin(kV2, lim, 'base', { subj: o.subj }) : null;
        if (v1 && v2 && v2.end === lim && verbal(v1.pred) && verbal(v2.pred)) {
          name('not-only');
          const vgN = Object.assign({}, vg, { neg: false, advs: vg.advs.filter((x) => !/^(?:only|just|merely|simply)$/.test(x.w || '')) });
          return done(vgN, P(vpJoin(v1, 'dict') + 'だけでなく、' + vpJoin(v2, 'dict')), newSt(vgN), lim, 'SVO', o, [], { noStative: true });
        }
        fail(mNo);
      }
    }
    const advs0 = vg.advs.slice();
    const gapUsed0 = o.gap ? o.gap.used : false;
    let best = null;
    const fns = [vpBeIdiom, vpIdiom, vpPassiveInf, vpPassiveList, vpFrame, vpGeneric];""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
