import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The key lies not in A but in B / comes not from A but from B / works not for A but for B
# → not + A + but を除いた動詞句（lies in B）を読み、B の前に「Aではなく、」を差し込む
rep("""    const kV1 = vg.neg && vg.modal && vg.idx >= 0 && vg.idx < i""",
    """    if (isW(T[i], 'not') && !vg.neg && !o.noNotBut && T[i + 1] && T[i + 1].k === 'w' && PREP[T[i + 1].w] && i + 4 < lim) {
      const mNp = mark();
      const pA = parsePP(i + 1, lim, { noCoord: true, verbal: true, lemma: vg.lemma });
      const kB = pA && isW(T[pA.end], 'but') ? pA.end + 1 : (pA && isP(T[pA.end], ',') && isW(T[pA.end + 1], 'but') ? pA.end + 2 : -1);
      if (pA && kB > 0 && kB < lim && isW(T[kB], T[i + 1].w)) {
        const pB = parsePP(kB, lim, { verbal: true, lemma: vg.lemma });
        const off = kB - i;
        const tN = T.slice(0, i).concat(T.slice(kB));
        const rN = pB ? withTokens(tN, () => parseVP(vg, i, lim - off, Object.assign({}, o, { noNotBut: true }))) : null;
        if (rN && rN.end === lim - off && rN.parts) {
          name('not-but');
          const aJa = pA.ja.replace(/(?:に|で|へ|から|のために)$/, (m0) => (m0 === 'のために' ? 'のため' : (m0 === 'から' ? 'から' : ''))) + 'ではなく、';
          const ix = rN.parts.findIndex((x) => x.indexOf(pB.ja) >= 0);
          rN.parts = ix >= 0 ? rN.parts.map((x, q) => (q === ix ? x.replace(pB.ja, aJa + pB.ja) : x)) : [aJa].concat(rN.parts);
          rN.end = lim;
          return rN;
        }
      }
      fail(mNp);
    }
    const kV1 = vg.neg && vg.modal && vg.idx >= 0 && vg.idx < i""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
