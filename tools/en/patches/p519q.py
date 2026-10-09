import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 1) time that would otherwise be spent commuting → 本来なら通勤するのに費やされる時間
rep("""    (vg.advs || []).forEach((x) => { if (st.failNeg && x.w === 'never') return; addAdv(st, x.a, x.w); });""",
    """    (vg.advs || []).forEach((x) => { if (st.failNeg && x.w === 'never') return; if (x.w === 'otherwise' && vg.modal === 'would') { addAdv(st, { ja: '本来なら', kind: 'm', e: null }, x.w); return; } addAdv(st, x.a, x.w); });   // would otherwise be spent → 本来なら""")
rep("""    // 付帯状況の分詞（smiling / reading a book）
    if (ingVerb(j, lim)) {""",
    """    // be spent commuting / was wasted waiting → 通勤するのに費やされる（受け身の spend / waste + ～ing）
    if (vg && vg.passive && /^(?:spend|waste)$/.test(vg.lemma || '') && ingVerb(j, lim)) {
      const mSp = mark();
      const gSp = vpNonfin(j, lim, 'ing', {});
      if (gSp && verbal(gSp.pred)) { st.other.push(vpJoin(gSp, 'dict') + 'のに'); return gSp.end; }
      fail(mSp);
    }
    // 付帯状況の分詞（smiling / reading a book）
    if (ingVerb(j, lim)) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
