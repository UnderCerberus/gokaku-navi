import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# cities could become much more comfortable places to live → 住むのにずっと快適な場所 / a much more difficult problem → ずっと難しい問題
# （much / far + more / less + 形容詞 + 名詞の much は程度「ずっと・はるかに」。限定詞「多くの」にしない）
rep("""  function np(i, lim, o) {
    o = o || {};
    if (i >= lim || !T[i]) return null;
    if (T[i].w === 'thanks' && isW(T[i + 1], 'to')) return null;   // thanks to ~ は前置詞（名詞句にしない）
    const m = mark();
    const t = T[i];""",
    """  function np(i, lim, o) {
    o = o || {};
    if (i >= lim || !T[i]) return null;
    if (T[i].w === 'thanks' && isW(T[i + 1], 'to')) return null;   // thanks to ~ は前置詞（名詞句にしない）
    const m = mark();
    const t = T[i];
    {
      const kMm = /^(?:a|an)$/.test(t.w) ? i + 1 : i;
      const cmpMm = T[kMm + 1] && T[kMm + 1].k === 'w' && !!adjC(T[kMm + 1]) && adjC(T[kMm + 1]).form === 'comp' && !/^(?:more|less)$/.test(T[kMm + 1].w);
      const kNm = cmpMm ? kMm + 2 : kMm + 3;
      if (kNm < lim && T[kMm] && /^(?:much|far)$/.test(T[kMm].w || '') && (cmpMm || (/^(?:more|less)$/.test((T[kMm + 1] || {}).w || '') && T[kMm + 2] && adjC(T[kMm + 2]))) && T[kNm] && T[kNm].k === 'w' && !!nounC(T[kNm]) && !PREP[T[kNm].w] && !T.slice(kMm + 1, Math.min(lim, kMm + 6)).some((x) => isW(x, 'than'))) {
        const dMm = T[kMm].w === 'far' ? 'はるかに' : 'ずっと';
        const newMm = (kMm > i ? [T[i]] : []).concat(T.slice(kMm + 1, lim));
        const rMm = withTokens(newMm, () => np(0, newMm.length, o));
        if (rMm && /より/.test(rMm.ja || '')) return Object.assign({}, rMm, { ja: rMm.ja.replace(/より(?!.*より)/, T[kMm + 1].w === 'less' ? dMm + 'より少なく' : dMm), end: rMm.end + i + 1 });
        fail(m);
      }
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
