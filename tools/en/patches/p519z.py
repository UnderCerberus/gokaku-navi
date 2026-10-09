import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# what is polite in one country may be rude in another → ある国で（one + 名詞 … another の対比の one は「ある」）
rep("""    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    const m = mark();""",
    """    if (t.k === 'q') return t.speech ? null : { ja: t.ja, end: i + 1, quote: true };      // 語句の引用（"…" を 1 語にまとめたもの）。発言は動詞の枠で読む
    const m = mark();
    if (t.w === 'one' && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && !PREP[T[i + 1].w] && !isW(T[i + 1], 'of') && T.slice(i + 2).some((x) => x.k === 'w' && x.w === 'another') && !(i > 0 && /^(?:the|only|no|every|any|this|that)$/.test(T[i - 1].w || ''))) {
      const nOne = nominal(i + 1, lim, true);
      if (nOne && nOne.end === i + 2) return postMod({ ja: 'ある' + nOne.ja, end: nOne.end, head: nOne.head, an: nOne.an, c: nOne.c, oneOf: true }, lim, o);   // in one country … in another → ある国で
      fail(m);
    }""")
# in one country（対比の ある + 場所）は で
rep("""      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');""",
    """      case 'in':
        if (few) return R(n + 'で', 'other', n + 'での');
        if (obj.oneOf) return R(n + 'では', 'place', n + 'での');   // in one country … in another → ある国では""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
