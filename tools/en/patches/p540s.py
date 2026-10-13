import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# sitting in the third row with a big smile on her face → 顔に満面の笑みを浮かべて / came in with a smile on her face → 顔に笑みを浮かべて
# （with + 笑顔 + on + 顔 は「顔に〜を浮かべて」。「笑顔を自分の顔に載せて」「彼女の顔の上に座っている」にしない）
rep("""  function withOC(i, lim) {
    if (!isW(T[i], 'with') || i + 2 >= lim) return null;""",
    """  function withOC(i, lim) {
    if (!isW(T[i], 'with') || i + 2 >= lim) return null;
    {
      const kOn = T.findIndex((x, q) => q > i + 1 && q < Math.min(lim, i + 6) && isW(x, 'on'));
      if (kOn > 0 && kOn + 2 < lim + 1 && T[kOn - 1].k === 'w' && /^(?:smile|smiles|grin|grins)$/.test(T[kOn - 1].w) && /^(?:my|your|his|her|our|their|the)$/.test((T[kOn + 1] || {}).w || '') && /^(?:face|faces)$/.test((T[kOn + 2] || {}).w || '')) {
        const mSf = mark();
        const nSf = np(i + 1, kOn, { noRel: true, noCoord: true });
        if (nSf && nSf.end === kOn) return { ja: '顔に' + nSf.ja.replace(/^(?:大きい|大きな|満面の)笑(?:顔|み)$/, '満面の笑み').replace(/笑顔$/, '笑み') + 'を浮かべて', end: kOn + 3 };
        fail(mSf);
      }
    }""")

# 名詞句のあとの with a big smile on her face は名詞につけない（3番目の列に座っている + 顔に満面の笑みを浮かべて）
rep("""      const j = node.end, t = T[j];
      if (j >= lim || !t) break;""",
    """      const j = node.end, t = T[j];
      if (j >= lim || !t) break;
      if (isW(t, 'with') && T.slice(j + 2, Math.min(lim, j + 6)).some((x, q) => isW(x, 'on') && /^(?:smile|smiles|grin|grins)$/.test(T[j + 1 + q].w || '') && /^(?:face|faces)$/.test((T[j + 4 + q] || {}).w || ''))) break;""")

# with a big smile on her face は決まり文句「満面の笑みで」で切らない（with-OC の「顔に満面の笑みを浮かべて」で読む）
rep("""      // on earth（一体全体）は疑問詞の直後だけ。ほかは場所の「地球上で」""",
    """      if (/^with (?:a|an) (?:[a-z]+ )?(?:smile|grin)$/.test(fx[k].toks.join(' ')) && isW(T[j + fx[k].toks.length], 'on') && /^(?:face|faces)$/.test((T[j + fx[k].toks.length + 2] || {}).w || '')) continue;
      // on earth（一体全体）は疑問詞の直後だけ。ほかは場所の「地球上で」""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
