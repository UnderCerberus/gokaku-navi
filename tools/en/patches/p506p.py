import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# see changing jobs as a natural part of life → 転職することを〜とみなす（V-ing + 語 が動詞の熟語（change jobs）なら動名詞を先に）
rep("""      let n = np(i, q, { noRel: true, noCoord: true }) || gerundNP(i, q) || bareG();""",
    """      const vIng = T[i].k === 'w' && DET[T[i].w] === undefined ? vc(T[i], ['ing']) : null;
      let n = null;
      if (vIng && (idiomIndex().verb[vIng.lemma] || []).some((it) => it.shape === 'fixed' && it.lit.length && i + it.lit.length < q && seq(i + 1, it.lit))) { n = gerundNP(i, q); if (!(n && n.end === q)) { fail(m); n = null; } }
      n = n || np(i, q, { noRel: true, noCoord: true }) || gerundNP(i, q) || bareG();""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
