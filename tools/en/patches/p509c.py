import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# Honesty is considered one of the most important qualities / it was considered a luxury that only the rich could afford → 〜だと考えられていた
rep("""      if (!itC && T[i].k === 'w' && (DET[T[i].w] !== undefined || !!nounC(T[i]))) {
        const mCn = mark();
        const nC = np(i, lim, { noRel: true });
        if (nC && !nC.pron && (nC.end === lim || T[nC.end].k === 'p' || (T[nC.end].k === 'w' && (!!PREP[T[nC.end].w] || !!SUB[T[nC.end].w])))) {""",
    """      if (T[i].k === 'w' && (DET[T[i].w] !== undefined || !!nounC(T[i]) || isW(T[i], 'one'))) {
        const mCn = mark();
        let nC = np(i, lim, { noRel: true });
        if (nC && nC.end < lim && T[nC.end].k === 'w' && /^(?:that|which|who|whom|whose)$/.test(T[nC.end].w)) { const mC2 = mark(); const nC2 = np(i, lim, {}); if (nC2 && nC2.end > nC.end) nC = nC2; else fail(mC2); }
        if (nC && (!nC.pron || /^one/.test(nC.pron)) && (!itC || nC.end === lim || T[nC.end].k === 'p') && (nC.end === lim || T[nC.end].k === 'p' || (T[nC.end].k === 'w' && (!!PREP[T[nC.end].w] || !!SUB[T[nC.end].w])))) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
