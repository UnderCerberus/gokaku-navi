import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# spend more time on their smartphones than they would like to → 自分が望むより多くの時間を…（目的語の more と than の間に前置詞句）
rep("""  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;""",
    """  function tail(j, lim, st, o, vg) {
    for (let guard = 0; guard < 12 && j < lim; guard++) {
      const j0 = isP(T[j], ',') && j + 1 < lim ? j + 1 : j;
      if (isW(T[j0], 'than') && j0 + 1 < lim && vg && vg.idx >= 0 && vg.idx < j0 && T.slice(vg.idx + 1, j0).some((x) => x.k === 'w' && /^(?:more|less|fewer)$/.test(x.w))) {
        const mTh = mark();
        const elTh = thanEllipsis(j0 + 1, lim, o && o.subj);
        if (elTh) { st.other.unshift(elTh + 'より'); j = lim; continue; }
        const nTh = np(j0 + 1, lim, { noRel: true });
        if (nTh && nTh.end === lim) { st.other.unshift(nTh.ja + 'より'); j = lim; continue; }
        fail(mTh);
      }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
