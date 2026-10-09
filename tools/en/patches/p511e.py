import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# have the same access to education → 同じ教育の機会（the same の後ろに名詞があれば「同じもの」+ 使役にしない）
rep("""      if (detW === 'the' && !num && i + 2 <= lim && T[i + 1].k === 'w' && ELL[T[i + 1].w]) return postMod({ ja: ELL[T[i + 1].w], end: i + 2, pron: 'one' }, lim, o);""",
    """      if (detW === 'the' && !num && i + 2 <= lim && T[i + 1].k === 'w' && ELL[T[i + 1].w] && !(T[i + 1].w === 'same' && T[i + 2] && T[i + 2].k === 'w' && !!nounC(T[i + 2]) && !TIMEN[T[i + 2].w] && !PREP[T[i + 2].w] && !/^(?:yesterday|today|tomorrow|again|thing)$/.test(T[i + 2].w))) return postMod({ ja: ELL[T[i + 1].w], end: i + 2, pron: 'one' }, lim, o);""")

# the same bag as I do / the same access to education as boys do → 私と同じ・男子と同じ（as + 名詞句 + 助動詞だけの省略）
rep("""      if (isW(t, 'as') && /^同じ/.test(node.ja || '') && !node.pron && j + 1 < lim && !o.noPost) {
        const mSm = mark();
        const nSm = np(j + 1, lim, { noRel: true, noCoord: o.noCoord });""",
    """      if (isW(t, 'as') && /^同じ/.test(node.ja || '') && !node.pron && j + 1 < lim && !o.noPost) {
        const mSm = mark();
        const nSm0 = np(j + 1, lim, { noRel: true, noCoord: o.noCoord });
        const auxSm = nSm0 && nSm0.end < lim && T[nSm0.end].k === 'w' && (DO[T[nSm0.end].w] || BE[T[nSm0.end].w] || MODAL[T[nSm0.end].w] || HAVE[T[nSm0.end].w]) && (nSm0.end + 1 >= lim || T[nSm0.end + 1].k === 'p');
        const nSm = auxSm ? Object.assign({}, nSm0, { end: nSm0.end + 1 }) : nSm0;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
