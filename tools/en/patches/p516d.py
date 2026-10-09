import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# don't have as much free time as before → as much + 名詞 + as は前置詞の as（として）にしない
rep("""    if (!t || i >= lim || t.k !== 'w' || (approxAt(i, lim) && !o.allowApprox)) return null;
    if (--BUDGET < 0) return null;
    const m = mark();
    let key = mprepAt(i), j = i, idi = null;""",
    """    if (!t || i >= lim || t.k !== 'w' || (approxAt(i, lim) && !o.allowApprox)) return null;
    if (t.w === 'as' && T[i + 1] && /^(?:much|many|few|little)$/.test(T[i + 1].w || '') && T[i + 2] && T[i + 2].k === 'w' && !isW(T[i + 2], 'as') && T.slice(i + 3, Math.min(lim, i + 7)).some((x) => isW(x, 'as'))) return null;   // as much free time as before
    if (--BUDGET < 0) return null;
    const m = mark();
    let key = mprepAt(i), j = i, idi = null;""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
