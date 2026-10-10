import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# They study less than others / sleep less than those without them → 他の人たちより少なく勉強する（目的語のない動詞 + less than。数の less than は目的語）
rep("""    if (isW(t, 'more') && vg && vg.lemma !== 'be' && isW(T[j + 1], 'than') && j + 2 < lim) {
      const mMt = mark();
      const elM = thanEllipsis(j + 2, lim, o.subj || null);
      if (elM) { name('comparative'); st.manner.push(elM + 'より多く'); return lim; }
      const nMt = np(j + 2, lim, { noRel: true });
      if (nMt) { name('comparative'); st.manner.push(nMt.ja + 'より多く'); return nMt.end; }""",
    """    if ((isW(t, 'more') || isW(t, 'less')) && vg && vg.lemma !== 'be' && isW(T[j + 1], 'than') && j + 2 < lim) {
      const mMt = mark();
      const jMt = isW(t, 'less') ? 'より少なく' : 'より多く';
      const elM = thanEllipsis(j + 2, lim, o.subj || null);
      if (elM) { name('comparative'); st.manner.push(elM + jMt); return lim; }
      const nMt = np(j + 2, lim, { noRel: true });
      if (nMt && !(isW(t, 'less') && (nMt.num || T[j + 2].k === 'num' || NUMW[T[j + 2].w] !== undefined))) { name('comparative'); st.manner.push(nMt.ja + jMt); return nMt.end; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
