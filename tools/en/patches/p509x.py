import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# fly south → 南へ飛ぶ / fly thousands of kilometers south → 南へ何千キロメートルも飛ぶ（方角の語は移動の動詞の行き先）
rep("""      if (t.k !== 'w' || (cnt > 0 && NO_COMPOUND[t.w])) break;""",
    """      if (t.k !== 'w' || (cnt > 0 && NO_COMPOUND[t.w])) break;
      if (cnt > 0 && DIRW[t.w] && /^(?:kilometers?|kilometres?|miles?|meters?|metres?|feet|foot|steps?|blocks?|yards?)$/.test(head || '')) break;   // ten kilometers north""")
rep("""  function npNext(x) {""",
    """  const DIRW = dic({ north: '北', south: '南', east: '東', west: '西', northward: '北', southward: '南', eastward: '東', westward: '西', northeast: '北東', northwest: '北西', southeast: '南東', southwest: '南西' });
  const MOVEV = /^(?:fly|migrate|head|move|go|travel|sail|drive|walk|run|swim|flow|drift|march|ride|move|spread|shift|turn|come|return|expand)$/;
  function npNext(x) {""")
rep("""  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;""",
    """  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      if (T[j0] && T[j0].k === 'w' && DIRW[T[j0].w] && vg && MOVEV.test(vg.lemma) && (j0 + 1 >= lim || T[j0 + 1].k === 'p' || PREP[(T[j0 + 1] || {}).w] || /^(?:to|and|for|in|every)$/.test((T[j0 + 1] || {}).w || ''))) { st.other.unshift(DIRW[T[j0].w] + 'へ'); j = j0 + 1; continue; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
