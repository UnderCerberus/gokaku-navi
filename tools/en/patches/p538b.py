import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# we may not wake up or remember anything → 目が覚めず、何も覚えていないかもしれない / You must not touch or move the box → 触れたり箱を動かしたりしてはいけない
# I would not change or remove anything → 何も変えたり取り除いたりしないだろう / We cannot see or hear anything → 何も見たり聞こえたりできない
# （否定の助動詞 + A or B: 否定と助動詞を両方の動詞にかける。anything は 何も。後ろの動詞の目的語が 1 つだけなら両方で共有する）
rep("""    if (neg && (T[mi].w !== 'can' || mlen === 2)) return null;""",
    """    const negOr = neg && mlen === 1 && /^(?:may|might|will|would|should|must)$/.test(T[mi].w);
    if (neg && !negOr && (T[mi].w !== 'can' || mlen === 2)) return null;""")
rep("""    if (!conj || !cuts.length) return null;""",
    """    if (!conj || !cuts.length) return null;
    if (negOr && (conj !== 'or' || cuts.length !== 1)) return null;""")
rep("""    try { c0 = withTokens(firstT, () => clause(0, firstT.length, {})); } finally { NO_AGREE = false; }
    if (!c0 || !c0.subj || !c0.pred || !verbal(c0.pred) || c0.neg) return fail(m);""",
    """    try { c0 = withTokens(firstT, () => clause(0, firstT.length, neg ? { negHint: true } : {})); } finally { NO_AGREE = false; }
    if (!c0 || !c0.subj || !c0.pred || !verbal(c0.pred) || (c0.neg && !neg)) return fail(m);
    if (negOr && !/^(?:v5|v1|suru|kuru)$/.test(c0.pred.cls)) return fail(m);""")
rep("""      const pv = predOnly(begins[k], ends[k], { subj: c0.subj });
      if (!pv || !pv.pred || pv.neg || pv.modal) return fail(m);
      rest.push(pv);
    }""",
    """      const pv = predOnly(begins[k], ends[k], neg ? { subj: c0.subj, negHint: true } : { subj: c0.subj });
      if (!pv || !pv.pred || (pv.neg && !neg) || pv.modal) return fail(m);
      rest.push(pv);
    }
    let shN = '';
    const lR0 = rest[rest.length - 1];
    if (neg && rest.length === 1 && ends[0] === v0 + 1 && !(c0.parts || []).length && (lR0.parts || []).length === 1 && (/を$/.test(lR0.parts[0]) || /^(?:何|誰)も$/.test(lR0.parts[0]))) {
      const fT2 = firstT.concat(T.slice(begins[1] + 1, b));
      let c0b = null;
      NO_AGREE = true;
      try { c0b = withTokens(fT2, () => clause(0, fT2.length, { negHint: true })); } finally { NO_AGREE = false; }
      if (c0b && c0b.subj && c0b.pred && verbal(c0b.pred) && (c0b.parts || []).length === 1 && c0b.parts[0] === lR0.parts[0]) { c0 = c0b; shN = lR0.parts[0]; }
    }""")
rep("""      const lastT = T.slice(0, bl).concat(T.slice(mi, mi + mlen), T.slice(bl, b));""",
    """      const lastT = T.slice(0, bl).concat(T.slice(mi, mi + mlen + (negOr ? 1 : 0)), T.slice(bl, b));""")
rep("""      const lastR = rest[rest.length - 1];
      const shObj = singleV1""",
    """      const lastR = rest[rest.length - 1];
      const outP = (c, y) => (c.neg ? clauseOut(Object.assign({}, c, { neg: false }), y) : c.out(y));
      const stripN = (str) => (shN && str.indexOf(shN) === 0 ? str.slice(shN.length) : str);
      if (negOr) {
        const fN = x.form || 'end';
        const endN = (prN) => (fN === 'te' ? prN.form('te') : (fN === 'attr' || fN === 'node') ? prN.plain() : prN.end({ polite: !!x.polite }));
        if (shN || mw === 'should' || mw === 'must') {
          const pcN = [outP(c0, { form: 'tari', part: x.part, omit: x.omit }), stripN(outP(lastR, { form: 'tari', omit: sp }))];
          const prN = mw === 'must' ? P('してはいけない', 'i') : mw === 'should' ? P('すべきではない', 'i') : /^(?:may|might)$/.test(mw) ? P('しないかもしれない', 'i') : P('しないだろう', 'fix');
          return pcN.join(pcN[1].length > 6 ? '、' : '') + endN(prN);
        }
        const pz = c0.pred;
        const zu = pz.cls === 'suru' ? pz.s.slice(0, -2) + 'せず' : (/ている$/.test(pz.s) ? pz.s.slice(0, -3) + 'ておらず' : pz.form('nai') + 'ず');
        return clauseOut(Object.assign({}, c0, { neg: false, pred: P(zu, 'fix') }), { form: 'end', part: x.part, omit: x.omit }) + '、' + lastM.out(Object.assign({}, x, { part: undefined, omit: sp }));
      }
      const shObj = singleV1""")
rep("""      if (mw === 'can') {   // 〜たり〜たりできる
        const pcs = [withObj(c0.out({ form: 'tari', part: x.part, omit: x.omit }), c0.pred.form('past') + 'り')].concat(rest.map((r) => noObj(r.out({ form: 'tari', omit: sp }))));""",
    """      if (mw === 'can') {   // 〜たり〜たりできる
        const pcs = shN ? [outP(c0, { form: 'tari', part: x.part, omit: x.omit }), stripN(outP(lastR, { form: 'tari', omit: sp }))]
          : [withObj(outP(c0, { form: 'tari', part: x.part, omit: x.omit }), c0.pred.form('past') + 'り')].concat(rest.map((r) => noObj(outP(r, { form: 'tari', omit: sp }))));""")

# predOnly でも negHint を受ける（否定の助動詞 + or の後ろの動詞句: remember anything → 何も）
rep("""    const vp = parseVP(vg, vg.end, b, o || {});
    if (!vp || vp.end !== b) return fail(m);
    return mkClause(null, vp, '');""",
    """    if (o && o.negHint && !vg.neg) vg.neg = true;
    const vp = parseVP(vg, vg.end, b, o || {});
    if (!vp || vp.end !== b) return fail(m);
    return mkClause(null, vp, '');""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
