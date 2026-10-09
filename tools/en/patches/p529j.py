import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# are required by law to donate … → 法律で〜寄付することが求められている（受け身と to の間の副詞句は飛ばして、受け身 + to 不定詞で読む）
rep("""    if (!vg.passive || !isW(T[i], 'to') || i + 1 >= lim) return null;
    const L = vg.lemma;""",
    """    if (vg.passive && !isW(T[i], 'to') && i + 2 < lim && !o.advPi) {
      const fxPi = fixedAt(i, lim);
      const advEnd = fxPi ? fxPi.end : (T[i].k === 'w' && /ly$/.test(T[i].w) && !!advC(T[i]) && !adjC(T[i]) ? i + 1 : -1);
      if (advEnd > i && isW(T[advEnd], 'to') && advEnd + 1 < lim && T[advEnd + 1].k === 'w' && !!vc(T[advEnd + 1], ['base'])) {
        const mPi = mark();
        const nOt = st.other.length, nMn = st.manner.length;
        if (fxPi) st.other.push(fxPi.ja); else addAdv(st, advC(T[i]), T[i].w);
        const tPi = T.slice(0, i).concat(T.slice(advEnd));
        const rPi = withTokens(tPi, () => vpPassiveInf(vg, i, lim - (advEnd - i), st, Object.assign({}, o, { advPi: true })));
        if (rPi) { rPi.end = lim; return rPi; }
        st.other.length = nOt; st.manner.length = nMn;
        fail(mPi);
      }
    }
    if (!vg.passive || !isW(T[i], 'to') || i + 1 >= lim) return null;
    const L = vg.lemma;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
