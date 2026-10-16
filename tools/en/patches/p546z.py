import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# hearing nothing but my own breathing → 自分の呼吸しか聞こえずに / I heard nothing but the wind → 風しか聞こえなかった（nothing but + 名詞句は「〜しか…ない」）
rep("""      if (t.k === 'w' && t.w === 'only' && j0 === j && !vg.neg && j0 + 1 < lim) {""",
    """      if (t.k === 'w' && t.w === 'nothing' && isW(T[j0 + 1], 'but') && j0 === j && objs.length === 0 && !vg.neg && !vg.passive && j0 + 2 < lim) {
        const mNb = mark();
        const nNb = np(j0 + 2, lim, { noRel: true });
        if (nNb && !nNb.pron) { objs.push(Object.assign({}, nNb, { shika: true })); st.neg = true; j = nNb.end; continue; }
        fail(mNb);
      }
      if (t.k === 'w' && t.w === 'only' && j0 === j && !vg.neg && j0 + 1 < lim) {""")

# we had fallen to third → 3位に落ちていた / finished in first place → 1位で（順位の序数は「〜位」）
rep("""  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;""",
    """  function modOther(j, lim, st, o, vg) {
    const t = T[j];
    if (!t || j >= lim || t.k !== 'w') return -1;
    const ORDP = { first: '1', second: '2', third: '3', fourth: '4', fifth: '5', sixth: '6', seventh: '7', eighth: '8', ninth: '9', tenth: '10', last: '最下' };
    if (vg && isW(t, 'to') && T[j + 1] && ORDP[T[j + 1].w] && (j + 2 >= lim || T[j + 2].k === 'p') && /^(?:fall|drop|rise|move|climb|slip|come|jump|go|sink)$/.test(vg.lemma)) { st.other.push(ORDP[T[j + 1].w] + '位に'); return j + 2; }
    if (vg && isW(t, 'in') && T[j + 1] && ORDP[T[j + 1].w] && isW(T[j + 2], 'place')) { st.other.push(ORDP[T[j + 1].w] + '位で'); return j + 3; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
