import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# has more to do with emotions than with time management → 時間管理よりも感情と…（比較の than + 前置詞句）
rep("""    if (isW(t, 'too') && isW(T[j + 1], 'little') && vg && !vg.passive && (j + 2 >= lim || T[j + 2].k === 'p' || (T[j + 2].k === 'w' && !nounC(T[j + 2]) && !adjC(T[j + 2])))) { st.manner.push('あまりにも少ししか'); st.neg = true; return j + 2; }""",
    """    if (isW(t, 'than') && j + 2 < lim && T[j + 1].k === 'w' && !!PREP[T[j + 1].w] && T.slice(0, j).some((x, q) => x.k === 'w' && /^(?:more|less)$/.test(x.w) && !(T[q + 1] && T[q + 1].k === 'w' && (!!adjC(T[q + 1]) || !!advC(T[q + 1]))))) {
      const mTp = mark();
      const pTp = parsePP(j + 1, lim, {});
      if (pTp && (pTp.end === lim || T[pTp.end].k === 'p')) { name('comparative'); st.other.unshift(T[j + 1].w === 'with' && pTp.obj ? pTp.obj.ja + 'よりも' : pTp.ja + 'よりも'); return pTp.end; }
      fail(mTp);
    }
    if (isW(t, 'too') && isW(T[j + 1], 'little') && vg && !vg.passive && (j + 2 >= lim || T[j + 2].k === 'p' || (T[j + 2].k === 'w' && !nounC(T[j + 2]) && !adjC(T[j + 2])))) { st.manner.push('あまりにも少ししか'); st.neg = true; return j + 2; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
