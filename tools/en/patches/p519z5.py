import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# snap diff の見直し（第 514 組）
# 1) Few scholars today … は few の規則（〜する学者はほとんどいない）に任せる
rep("""            if (x === s1 && /^(?:today|nowadays)$/.test(T[x].w) && sj && !sj.pron && (sj.pl || sj.an""",
    """            if (x === s1 && /^(?:today|nowadays)$/.test(T[x].w) && sj && !sj.pron && !sj.fewNeg && !sj.fewRel && !/^ほとんどの/.test(sj.ja || '') && (sj.pl || sj.an""")
# 2) from one task to another は既存の from one ~ to another に任せる
rep("""    if (t.w === 'one' && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && !PREP[T[i + 1].w] && !isW(T[i + 1], 'of') &&""",
    """    if (t.w === 'one' && !(i > 0 && isW(T[i - 1], 'from')) && T[i + 1] && T[i + 1].k === 'w' && !!nounC(T[i + 1]) && !PREP[T[i + 1].w] && !isW(T[i + 1], 'of') &&""")
# 3) time spent commuting（分詞の修飾）は前のまま。受け身の定形（would be spent commuting）だけ のに
rep("""    if (vg && vg.passive && /^(?:spend|waste)$/.test(vg.lemma || '') && ingVerb(j, lim)) {""",
    """    if (vg && vg.passive && !vg.nonfin && /^(?:spend|waste)$/.test(vg.lemma || '') && ingVerb(j, lim)) {""")
# 4) would otherwise be thrown away / wasted は既存の文末処理（本来なら捨てられてしまう）に任せる
rep("""if (x.w === 'otherwise' && vg.modal === 'would') {""",
    """if (x.w === 'otherwise' && vg.modal === 'would' && !/^(?:throw|waste)$/.test(vg.lemma || '')) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
