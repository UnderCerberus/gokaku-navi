import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The store closed down a few years ago / He gave up a few years ago（句動詞のあとが時の句なら、目的語なしの熟語を使う）
rep("""        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub)) && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join(' '))) continue;""",
    """        const timeNx = T.slice(i + n, Math.min(lim, i + n + 5)).some((x) => isW(x, 'ago')) || (!!T[i + n] && /^(?:last|this|next|every|each)$/.test(T[i + n].w || '') && !!T[i + n + 1] && /^(?:year|years|month|months|week|weeks|day|days|night|morning|evening|afternoon|time|summer|winter|spring|autumn|fall|semester|weekend)$/.test(T[i + n + 1].w || ''));   // closed down a few years ago
        if (i + n < lim && T[i + n].k === 'w' && (DET[T[i + n].w] !== undefined || (PRON[T[i + n].w] && !PRON[T[i + n].w].sub)) && !timeNx && list.some((x) => x.shape === 'obj' && x.lit.join(' ') === it.lit.join(' '))) continue;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
