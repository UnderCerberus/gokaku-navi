import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# many young people would feel completely lost → 完全に途方に暮れるだろう / They felt lost（feel / look + lost を補語として読む。解析失敗にしない）
rep("""    const a = k < lim ? adjC(T[k]) : null;
    if (!a) return null;""",
    """    const a = k < lim ? adjC(T[k]) : null;
    if (!a && k < lim && isW(T[k], 'lost') && (k + 1 >= lim || T[k + 1].k === 'p' || (T[k + 1].k === 'w' && (!!PREP[T[k + 1].w] || /^(?:and|but|because|when|if|without|again|now)$/.test(T[k + 1].w))))) return { adj: en.jp.adj('途方に暮れた'), deg: deg, end: k + 1, e: null, idx: k, form: 'base', lemma: 'lost' };   // feel lost
    if (!a) return null;""")
rep("""        if (ap.lemma === 'old' && sjA && /^(?:become|get|grow)$/.test(L)) { core = P('年をとる', 'v5'); ap.deg = ''; }      // grow old(er)""",
    """        if (ap.lemma === 'old' && sjA && /^(?:become|get|grow)$/.test(L)) { core = P('年をとる', 'v5'); ap.deg = ''; }      // grow old(er)
        else if (ap.lemma === 'lost' && /^(?:feel|look|seem|appear|sound)$/.test(L)) { core = L === 'feel' ? P(ap.deg + '途方に暮れる', 'v1') : P(ap.deg + '途方に暮れているようだ', 'da'); ap.deg = ''; }   // feel completely lost → 完全に途方に暮れる""")

# feel completely lost（lost の前の程度の副詞も読む）
rep("""    const adjNext = !!adjC(nx) || isW(nx, 'more') || isW(nx, 'less');
    if (!adjNext) return null;""",
    """    const adjNext = !!adjC(nx) || isW(nx, 'more') || isW(nx, 'less') || isW(nx, 'lost');
    if (!adjNext) return null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
