import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# young birds kept in a room … turned in the direction …（名詞の主語 + 過去分詞にもなる他動詞 + 前置詞のあとに、さらに過去形の動詞があれば、分詞の後置修飾として後ろの動詞で区切る方を先に試す）
rep("""    for (let p = a + 1; p < b; p++) {
      if (!verbStart(p)) continue;""",
    """    const pOrd = [], pDef = [];
    for (let p = a + 1; p < b; p++) {
      const tp = T[p];
      const dfr = !!tp && tp.k === 'w' && /^(?:kept|held|placed|put|raised|fed|given|trained|brought|found|made|sold|built|grown|caught|collected|stored|shown|taken|chosen|hidden|seen|left)$/.test(tp.w) && p - a <= 4 && T[a].k === 'w' && !PRON[T[a].w] &&
        !!T[p + 1] && T[p + 1].k === 'w' && !!PREP[T[p + 1].w] && !/^(?:up|out|off|away|back|on|to)$/.test(T[p + 1].w) &&
        T.slice(p + 2, b).some((x, q) => x.k === 'w' && !!vc(x, ['past', '3sg']) && !nounC(x) && !/^(?:that|which|who|to|with)$/.test((T[p + 1 + q] || {}).w || ''));
      (dfr ? pDef : pOrd).push(p);
    }
    for (const p of pOrd.concat(pDef)) {
      if (!verbStart(p)) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
