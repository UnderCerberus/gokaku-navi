import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# the demand for electricity rises, which in turn leads to more emissions → そのことが今度は…につながる
# （in turn は 1 語の副詞として扱う。関係詞の which と動詞の間に入っても読めるように）
rep("""      if (w === 'longer' && out.length && out[out.length - 1].w === 'no' && out[out.length - 1].k === 'w') { out[out.length - 1].w = 'nolonger'; out[out.length - 1].s += ' ' + s; return; }""",
    """      if (w === 'longer' && out.length && out[out.length - 1].w === 'no' && out[out.length - 1].k === 'w') { out[out.length - 1].w = 'nolonger'; out[out.length - 1].s += ' ' + s; return; }
      if (w === 'turn' && out.length && out[out.length - 1].w === 'in' && out[out.length - 1].k === 'w' && (out.length === 1 || (out[out.length - 2].k === 'p' && out[out.length - 2].w === ',') || /^(?:which|that|who|this|it|they|he|she|we|these|those|and|but)$/.test(out[out.length - 2].w || ''))) { out[out.length - 1].w = 'inturn'; out[out.length - 1].s += ' ' + s; return; }""")

rep("""    nolonger: ['もはや', 'f', 1], allq: ['みな', 'f'],""",
    """    nolonger: ['もはや', 'f', 1], allq: ['みな', 'f'], inturn: ['今度は', 't'],""")

# In turn, this leads to … → その結果、（文頭のつなぎ言葉）
rep("""    someday: 'いつか', sometime: 'いつか', however: 'しかしながら',""",
    """    someday: 'いつか', sometime: 'いつか', inturn: 'その結果', however: 'しかしながら',""")

# The residents, in turn, agree … → 住民は今度は…（主語と動詞の間の , in turn , もつなぎ言葉）
rep("""/^(?:however|therefore|moreover|furthermore|nevertheless|instead|indeed|thus)$/.test(T[x + 1].w) && isP(T[x + 2], ',')) { len = 1; ja = LEAD[T[x + 1].w]; }""",
    """/^(?:however|therefore|moreover|furthermore|nevertheless|instead|indeed|thus|inturn)$/.test(T[x + 1].w) && isP(T[x + 2], ',')) { len = 1; ja = T[x + 1].w === 'inturn' ? '今度は' : LEAD[T[x + 1].w]; }""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
