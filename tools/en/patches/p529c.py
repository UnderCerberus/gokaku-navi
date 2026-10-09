import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# The documents were lost or destroyed → 失われたり破壊されたりした（形容詞にもなる過去分詞 + or / and + 過去分詞は受け身の並列）
rep("""    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""",
    """    if (isAdjHead(T[r.idx]) && T[r.idx].w !== 'born' && T[r.end] && T[r.end + 1] && /^(?:or|and)$/.test(T[r.end].w || '') && (!T[r.end + 2] || T[r.end + 2].k === 'p' || (T[r.end + 2].k === 'w' && !!PREP[T[r.end + 2].w] && T[r.end + 2].w !== 'to')) && T[r.end + 1].k === 'w' && !!vc(T[r.end + 1], ['pp']) && !isAdjHead(T[r.end + 1]) && !vc(T[r.end + 1], ['base']) && en.jp.senses(r.c.e.ja).some((s) => s.tr) && en.jp.senses((vc(T[r.end + 1], ['pp']).e || {}).ja || '').some((s) => s.tr)) return true;   // were lost or destroyed
    if (isAdjHead(T[r.idx])) return false;             // tired / interested / surprised は形容詞として扱う""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
