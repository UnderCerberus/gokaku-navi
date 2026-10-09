import io
p = r'C:\Claude\gokaku-navi\js\english\syntax.js'
s = io.open(p, encoding='utf-8').read()

def rep(old, new, cnt=1):
    global s
    n = s.count(old)
    assert n == cnt, (n, old[:80])
    s = s.replace(old, new)

# she knows the city better than most people → ほとんどの人々よりよく知っている（know / understand / remember の better は よく。上手に にしない）
rep("""    if (isW(T[k], 'more') && k + 1 < lim && advC(T[k + 1]) && !nounC(T[k + 1])) { more = true; k = k + 1; }
    const a = advC(T[k]);
    if (a) {""",
    """    if (isW(T[k], 'more') && k + 1 < lim && advC(T[k + 1]) && !nounC(T[k + 1])) { more = true; k = k + 1; }
    const a0K = advC(T[k]);
    const a = a0K && (a0K.comp || more) && /上手に$/.test(a0K.ja) && vg && /^(?:remember|understand|know|sleep|feel|see|hear|learn|recall|memorize|concentrate)$/.test(vg.lemma) && T.slice(k + 1, lim).some((x) => isW(x, 'than')) ? Object.assign({}, a0K, { ja: a0K.ja.replace(/上手に$/, 'よく') }) : a0K;
    if (a) {""")

io.open(p, 'w', encoding='utf-8', newline='\n').write(s)
print('ok')
