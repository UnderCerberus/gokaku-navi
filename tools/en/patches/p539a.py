import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# …, nearly half are in danger of disappearing → ほぼ半分は（数量の half を代名詞として読む: Half are from Tokyo → 半分は。half an hour / half the time / half past は今までどおり）
rep("""    // Do whatever you like → 好きなことは何でもしなさい / whoever wants it → それを欲しい人は誰でも
    if (/^(?:whatever|whoever|whichever|whomever)$/.test(t.w) && i + 1 < lim && (!o.noWhat || /^(?:whoever|whomever)$/.test(t.w))) {""",
    """    {
      const kHf = /^(?:nearly|almost|about|roughly|approximately|over|just|only)$/.test(t.w) && isW(T[i + 1], 'half') ? i + 1 : (seq(i, ['more', 'than', 'half']) ? i + 2 : (t.w === 'half' ? i : -1));
      if (kHf >= 0 && (kHf + 1 >= lim || T[kHf + 1].k === 'p' || (T[kHf + 1].k === 'w' && (!!BE[T[kHf + 1].w] || !!MODAL[T[kHf + 1].w] || !!HAVE[T[kHf + 1].w] || !!DO[T[kHf + 1].w] || (!!vc(T[kHf + 1], ['past', '3sg', 'base']) && !nounC(T[kHf + 1]) && !PREP[T[kHf + 1].w]))))) {
        const preHf = ({ nearly: 'ほぼ', almost: 'ほぼ', about: '約', roughly: '約', approximately: '約', just: 'ちょうど', only: 'たった' })[t.w] || '';
        return postMod({ ja: preHf + '半分' + (t.w === 'over' || t.w === 'more' ? '以上' : ''), end: kHf + 1, pron: 'half', pl: true }, lim, o);
      }
    }
    // Do whatever you like → 好きなことは何でもしなさい / whoever wants it → それを欲しい人は誰でも
    if (/^(?:whatever|whoever|whichever|whomever)$/.test(t.w) && i + 1 < lim && (!o.noWhat || /^(?:whoever|whomever)$/.test(t.w))) {""")

# verbStart: 限定詞にもなる half のあとの be / 助動詞は動詞の始まり（Half are from Tokyo）
rep("""    const qtyEnd = !!pv && pv.k === 'w' && /^(?:much|many|enough|little|more|less|few)$/.test(pv.w)""",
    """    const qtyEnd = !!pv && pv.k === 'w' && /^(?:much|many|enough|little|more|less|few|half)$/.test(pv.w)""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
