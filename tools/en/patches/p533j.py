import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# rather than on just one / I want just one → 1つだけ（just / only + 名詞の続かない one）
rep("""    // about ten / nearly 100 / over 50（数をぼかす語）
    if (/^(?:about|around|approximately|nearly|almost|over|only|just)$/.test(t.w) && i + 1 < lim && !o.noApprox) {""",
    """    if (/^(?:just|only)$/.test(t.w) && isW(T[i + 1], 'one') && !o.noApprox && (i + 2 >= lim || T[i + 2].k === 'p' || (T[i + 2].k === 'w' && (!!PREP[T[i + 2].w] || /^(?:and|or|but|because|when|if|than|so)$/.test(T[i + 2].w)) && !isW(T[i + 2], 'of')))) return { ja: '1つだけ', end: i + 2, pron: 'one', num: { val: 1, ja: '1' }, bare: true };
    // about ten / nearly 100 / over 50（数をぼかす語）
    if (/^(?:about|around|approximately|nearly|almost|over|only|just)$/.test(t.w) && i + 1 < lim && !o.noApprox) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
