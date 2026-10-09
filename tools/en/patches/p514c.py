import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# without being + 過去分詞: 範囲で切られて読めないときは、ほかの読み（being を名詞にする等）をさせない
rep("""    if (key === 'without' && !idi && isW(T[j], 'being') && j + 1 < lim && T[j + 1].k === 'w' && !!vc(T[j + 1], ['pp'])) {
      const mWb = mark();
      const vWb = vpNonfin(j + 1, lim, 'pp', {});
      if (vWb && vWb.vg && vWb.vg.e) return { ja: vWb.parts.join('') + P(verbSense(vWb.vg.e, true).core).aux('pass').plain() + 'ことなく', kind: 'other', end: vWb.end, prep: 'without' };
      fail(mWb);
    }""",
    """    if (key === 'without' && !idi && isW(T[j], 'being') && T[j + 1] && T[j + 1].k === 'w' && !!vc(T[j + 1], ['pp'])) {
      if (j + 1 >= lim) return fail(m);
      const mWb = mark();
      const vWb = vpNonfin(j + 1, lim, 'pp', {});
      if (vWb && vWb.vg && vWb.vg.e) return { ja: vWb.parts.join('') + P(verbSense(vWb.vg.e, true).core).aux('pass').plain() + 'ことなく', kind: 'other', end: vWb.end, prep: 'without' };
      fail(mWb);
      return fail(m);
    }""")

# spread by A and later by B → Aによって、そしてのちにBによって（受け身の動作主の並列）
rep("""      if (ppA && ppA.ja) {
        const advA = ({ eventually: '最終的には', finally: '最後に', then: 'それから', later: 'のちに', even: 'さらには', also: 'また' })[T[j + 1].w];""",
    """      if (ppA && ppA.ja && st.agent && isW(T[j + 2], 'by') && ppA.obj && vg && vg.passive) {
        const advB = ({ eventually: '最終的には', finally: '最後に', then: 'それから', later: 'のちに', even: 'さらには', also: 'また' })[T[j + 1].w];
        st.agent = st.agent.replace(/(?:によって|に)$/, 'によって') + '、そして' + advB + ppA.obj.ja + 'によって';
        return ppA.end;
      }
      if (ppA && ppA.ja) {
        const advA = ({ eventually: '最終的には', finally: '最後に', then: 'それから', later: 'のちに', even: 'さらには', also: 'また' })[T[j + 1].w];""")

# whether he would ever see his son again → いつか（would / will + ever は経験の「今までに」ではない）/ see + 家族・友人 → 会う
rep("""    (vg.advs || []).forEach((x) => addAdv(st, x.a, x.w));
    vg.advs = [];""",
    """    (vg.advs || []).forEach((x) => addAdv(st, x.a, x.w));
    vg.advs = [];
    if (!vg.perfect && /^(?:would|will|could|can|might|may)$/.test(vg.modal || '') && st.freq.indexOf('今までに') >= 0) { st.freq = st.freq.map((x) => (x === '今までに' ? 'いつか' : x)); st.exp = false; }""")
rep("""    'make|money fortune|を|稼ぐ',""",
    """    'make|money fortune|を|稼ぐ', 'see|son sons daughter daughters mother father parents family families friend friends grandmother grandfather grandparents wife husband children child brother brothers sister sisters relatives|に|会う',""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
