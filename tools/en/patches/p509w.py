import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# 動詞の前の alone は「〜だけ」（主語を限る）: 動詞の前の副詞にしない（Technology alone will not … → 科学技術だけでは）
rep("""    if (/^(?:yesterday|tomorrow|tonight)$/.test(t.w)) return false;              // the book I bought yesterday is""",
    """    if (/^(?:yesterday|tomorrow|tonight|alone)$/.test(t.w)) return false;              // the book I bought yesterday is""")
# 肯定: He alone knows the truth → 彼だけが（否定は だけで + は → だけでは）
rep("""    if (first.end < lim && isW(T[first.end], 'alone') && T[first.end + 1] && T[first.end + 1].k === 'w' && !first.pron && (/^(?:cannot|can't|won't)$/.test(T[first.end + 1].w) || ((MODAL[T[first.end + 1].w] || BE[T[first.end + 1].w] || DO[T[first.end + 1].w]) && /^(?:not|n't)$/.test((T[first.end + 2] || {}).w || '')))) {
      return Object.assign({}, first, { ja: first.ja + 'だけで', end: first.end + 1 });
    }""",
    """    if (first.end < lim && isW(T[first.end], 'alone') && T[first.end + 1] && T[first.end + 1].k === 'w' && (/^(?:cannot|can't|won't)$/.test(T[first.end + 1].w) || ((MODAL[T[first.end + 1].w] || BE[T[first.end + 1].w] || DO[T[first.end + 1].w]) && /^(?:not|n't)$/.test((T[first.end + 2] || {}).w || '')))) {
      return Object.assign({}, first, { ja: first.ja + 'だけで', end: first.end + 1, pron: undefined });
    }
    if (first.end < lim && isW(T[first.end], 'alone') && T[first.end + 1] && T[first.end + 1].k === 'w' && (MODAL[T[first.end + 1].w] || BE[T[first.end + 1].w] || DO[T[first.end + 1].w] || HAVE[T[first.end + 1].w] || (!!vc(T[first.end + 1], ['3sg', 'past']) && !nounC(T[first.end + 1])))) {
      return Object.assign({}, first, { ja: first.ja + 'だけ', end: first.end + 1, pron: undefined });
    }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
