import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the skills needed to understand other people's feelings are still developing（名詞 + needed / required / used / designed + to 不定詞 + 後ろに be・定動詞があれば、分詞の後置修飾として後ろの動詞で区切る方を先に試す）
rep("""        T.slice(p + 2, b).some((x, q) => x.k === 'w' && !!vc(x, ['past', '3sg']) && !nounC(x) && !/^(?:that|which|who|to|with)$/.test((T[p + 1 + q] || {}).w || ''));
      (dfr ? pDef : pOrd).push(p);""",
    """        T.slice(p + 2, b).some((x, q) => x.k === 'w' && !!vc(x, ['past', '3sg']) && !nounC(x) && !/^(?:that|which|who|to|with)$/.test((T[p + 1 + q] || {}).w || ''));
      const dfrTo = !dfr && !!tp && tp.k === 'w' && /^(?:needed|required|used|designed|meant|intended|built|made)$/.test(tp.w) && p - a <= 4 && T[a].k === 'w' && !PRON[T[a].w] && p > a && T[p - 1].k === 'w' && !!nounC(T[p - 1]) &&
        isW(T[p + 1], 'to') && !!T[p + 2] && T[p + 2].k === 'w' && !!vc(T[p + 2], ['base']) && T.slice(p + 3, b).some((x) => x.k === 'w' && (!!BE[x.w] || !!MODAL[x.w] || (!!HAVE[x.w] && /^(?:has|have|had)$/.test(x.w))));
      (dfr || dfrTo ? pDef : pOrd).push(p);""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
