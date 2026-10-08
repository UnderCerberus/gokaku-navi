import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the way people work in the near future → 近い将来、人々の働き方を変える（文末の未来・生涯の時の句は the way 節に入れず主節につける）
rep("""  const pick = (i, e) => { if (e && T[i] && T[i].oi !== undefined) SEL.push([T[i].oi, e]); };""",
    """  // 主節につける文末の時の句（the way 節に入れない）: in the near future / in the future / for the rest of one's life …
  function mainTimeStart(j, e) {
    const ws = T.slice(j, e).map((x) => x.w || '');
    const L = ws.length;
    const ends = (arr) => L > arr.length && arr.every((w, q) => (w === '*poss' ? /^(?:my|your|his|her|our|their|its)$/.test(ws[L - arr.length + q]) : (w === '*life' ? /^(?:life|lives)$/.test(ws[L - arr.length + q]) : ws[L - arr.length + q] === w)));
    const PH = [['in', 'the', 'near', 'future'], ['in', 'the', 'future'], ['in', 'the', 'years', 'to', 'come'], ['in', 'the', 'coming', 'years'], ['in', 'the', 'long', 'run'], ['for', 'the', 'rest', 'of', '*poss', '*life']];
    for (const ph of PH) if (ends(ph)) return e - ph.length;
    return -1;
  }
  const pick = (i, e) => { if (e && T[i] && T[i].oi !== undefined) SEL.push([T[i].oi, e]); };""")
rep("""      if (cw && cw.pred && WAYV[cw.pred.s] && !(cw.parts || []).length && !cw.neg && cw.subj && cw.subj.ja && !cw.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + WAYV[cw.pred.s], end: e, rel: true }); }""",
    """      const eT = cw ? mainTimeStart(j, e) : -1;
      if (eT > j + 1) {
        const mT = mark();
        const cwT = clause(j, eT, { sub: true });
        if (cwT && cwT.pred && WAYV[cwT.pred.s] && !(cwT.parts || []).length && !cwT.neg && cwT.subj && cwT.subj.ja && !cwT.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cwT.subj.ja + 'の' + WAYV[cwT.pred.s], end: eT, rel: true }); }
        if (cwT) { e = eT; return fin(cwT.out({ part: 'が', form: 'attr' }), 'rel-adv'); }
        fail(mT);
      }
      if (cw && cw.pred && WAYV[cw.pred.s] && !(cw.parts || []).length && !cw.neg && cw.subj && cw.subj.ja && !cw.modal) { name('rel-adv'); return Object.assign({}, node, { ja: cw.subj.ja + 'の' + WAYV[cw.pred.s], end: e, rel: true }); }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
